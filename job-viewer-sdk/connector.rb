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
      title: 'Create New Job',
      description: 'Create New Job',
      input_fields: ->(object_definitions){
        object_definitions[:create_new_employee_job_input]
      },
      execute: ->(connection, input){
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
        
        response = call('create_new_employee_job', job_id, company_name, job_type, tenant_name, total_items_processed, total_invalid_items, job_timestamp)
        puts response
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

  triggers: {

  },

  methods: {
    create_new_employee_job: ->(job_id, company_name, job_type, tenant_name, total_items_processed, total_invalid_items, job_timestamp) {
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
      response
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
            name: "emnployees",
            label: "Employees",
            type: :array,
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
