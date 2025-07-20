{
  title: 'Job Viewer Sdk',

  connection: {
    authorization: {
      type: 'custom_auth'
    },

    base_uri: lambda do |connection|
      ''
    end
  },

  test: lambda do |connection|
    # Test the connection by making a simple API call
    response = get('https://vsa99h8mq4.execute-api.us-east-1.amazonaws.com/Prod/list-jobs')
    response
  end,

  actions: {
    create_new_employee_job: {
      title: 'Create New Employee Job',
      description: 'Create New Job',
      input_fields: ->(object_definitions){
        object_definitions[:create_new_employee_job_input]
      },
      execute: ->(connection, input){
        puts "creating new job"
        puts input
        # create new job from job viewer sdk
        # api call to create new job - https://vsa99h8mq4.execute-api.us-east-1.amazonaws.com/Prod/create-new-job
        job_id = input[:job_id]
        company_name = input[:company_name]
        job_type = input[:job_type]
        tenant_name = input[:tenant_name]
        total_items_processed = input[:total_items_processed]
        total_invalid_items = input[:total_invalid_items]
        job_timestamp = input[:job_timestamp]
        employees = input[:employees]
        puts "employees"
        puts employees
        
        response = call('create_new_employee_job', job_id, company_name, job_type, tenant_name, total_items_processed, total_invalid_items, job_timestamp)
        presigned_url = response['presignedUrl']
        s3_response = call('upload_job_log_to_s3', presigned_url, employees)

        
        return response
      },
    },
    list_jobs: {
      title: 'Get Jobs List',
      description: 'Get Job List',
      execute: ->(){
        # get job list from job viewer sdk
        # api call to list jobs - https://vsa99h8mq4.execute-api.us-east-1.amazonaws.com/Prod/list-jobs
        response = get('https://vsa99h8mq4.execute-api.us-east-1.amazonaws.com/Prod/list-jobs')
        puts response
        return response
      },
      output_fields: ->(object_definitions){
        object_definitions[:list_jobs_output]
        object_definitions[:list_jobs_output_count]
      }
    }
  },
  methods: {
    create_new_employee_job: ->(job_id, company_name, job_type, tenant_name, total_items_processed, total_invalid_items, job_timestamp) {
      puts "creating new job"
      input = {
        job_id: job_id,
        company_name: company_name,
        job_type: job_type,
        tenant_name: tenant_name,
        total_items_processed: total_items_processed,
        total_invalid_items: total_invalid_items,
        job_timestamp: job_timestamp,
      }
      response = put('https://vsa99h8mq4.execute-api.us-east-1.amazonaws.com/Prod/create-new-job', input)
      puts response
      response
    },

    # workato dopcumentation for using csv.generate
    # csv.generate
    # Allows you to generate a CSV string from a JSON array so you can send it to a downstream system as a file.
    # workato.csv.generate(headers: ["color", "amount"], col_sep: ";") do |csv|
    #   csv << [:blue, 1]
    #   csv << [:white, 2]
    # end
    # Takes five arguments:
    # headers
    # Either true (First row of actual CSV will be used as headers), array of string (corresponding to each column header) or string (Artificial first row of the CSV with appropriate column separator).
    # col_sep
    # The column separator in the CSV. Defaults to ,.
    # row_sep
    # The row separator in the CSV. Defaults to \n.
    # quote_char
    # The quoting character in the CSV. Defaults to double quotes ".
    # force_quotes
    # Boolean that determines whether each output field should be quoted.
    # Finally, one lambda that allows you to append individual rows to this CSV as an array of strings.
   
    json_to_csv: ->(json_data) {
      return '' if json_data.empty?
    
      keys = json_data.first.keys
      puts "keys"
      puts keys
    
      csv_string = workato.csv.generate(headers: keys) do |csv|
        json_data.each do |row|
          csv << keys.map { |k| row[k] }
        end
      end
      puts "csv_string"
      puts csv_string
      csv_string
    },
    upload_job_log_to_s3: ->(presigned_url, job_log) {
      puts "uploading job log to s3"
      return { error: "No presigned URL received from API" } if presigned_url.nil?
    
      csv_string = call('json_to_csv', job_log)
      bom = "\uFEFF"
      csv_with_bom = bom + csv_string
    
      require 'uri'
      require 'net/http'
    
      uri = URI.parse(presigned_url)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = (uri.scheme == 'https')
    
      request = Net::HTTP::Put.new(uri)
      request.body = csv_with_bom
      request['Content-Type'] = 'text/csv; charset=utf-8'
    
      response = http.request(request)
    
      puts "S3 Upload Response: #{response.code} #{response.message}"
      { status: response.code, message: response.message }
    }
  },

  object_definitions: {
    create_new_employee_job_input: {
      fields: ->(_connection, _config_fields, object_definitions){
        [
          {
            name: "company_name",
            label: "Company Name",
            type: :string,
          },
          {
            name: "job_type",
            label: "Job Type",
            type: :string,
          },
          {
            name: "tenant_name",
            label: "Tenant Name",
            type: :string,
          },
          {
            name: "job_id",
            label: "Job ID",
            type: :string,
          },
          {
            name: "total_items_processed",
            label: "Total Items Processed",
            type: :integer,
          },
          {
            name: "total_invalid_items",
            label: "Total Invalid Items",
            type: :integer,
          },
          {
            name: "job_timestamp",
            label: "Job Timestamp",
            type: :string,
          },
          {
            name: "employees",
            label: "Employees",
            type: :array,
            of: :object,
            properties: [
              {
                name: "first_name",
                label: "First Name",
                type: :string,
              },
              {
                name: "last_name",
                label: "Last Name",
                type: :string,
              },
              {
                name: "email",
                label: "Email",
                type: :string,
              }
            ]
          }
        ]
      }
    },
    list_jobs_output: {
      fields: ->(_connection, _config_fields, object_definitions){
        [
          {
            name: "jobId",
            label: "Job ID",
            type: :string,
          },
          {
            name: "companyName",
            label: "Company Name",
            type: :string,
          },
          {
            name: "jobType",
            label: "Job Type",
            type: :string,
          },
          {
            name: "tenantName",
            label: "Tenant Name",
            type: :string,  
          },
          {
            name: "totalItemsProcessed",
            label: "Total Items Processed",
            type: :integer,
          },
          {
            name: "totalInvalidItems",
            label: "Total Invalid Items",
            type: :integer,
          },
          {
            name: "jobTimestamp",
            label: "Job Timestamp",
            type: :string,
          },
          {
            name: "s3ObjectKey",
            label: "S3 Object Key",
            type: :string,
          }
        ]
      }
    },
    list_jobs_output_count: {
      fields: ->(_connection, _config_fields, object_definitions){
        [
          {
            name: "count",
            label: "Count",
            type: :integer,
          }
        ]
      }
    }
  },

  pick_lists: {

  }
}
