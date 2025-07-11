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

  end,

  actions: {
    get_job_list: {
      title: 'Get Jobs List',
      description: 'Get Job List',
      execute: ->(){
        puts 'Get Job List'
      }
    }
  },

  triggers: {

  },

  methods: {

  },

  object_definitions: {

  },

  pick_lists: {

  }
}
