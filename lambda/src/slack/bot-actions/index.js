let data = require('@architect/data')

exports.handler = async (event, context, callback) => {
  /**
   * Event Object:
   * {
      "type": "interactive_message",
      "actions": [
        {
          "name": "save",
          "type": "button",
          "value": "save"
        }
      ],
      "callback_id": "confirm_scrum",
      "team": {
        "id": "TCRCVH6BG",
        "domain": "clubwin"
      },
      "channel": {
        "id": "CEDLMAJLF",
        "name": "scrum-team-a"
      },
      "user": {
        "id": "UCPF52WNM",
        "name": "dtm15d"
      },
      "action_ts": "1543650195.575757",
      "message_ts": "1543650193.003000",
      "attachment_id": "1",
      "token": "q1ApjBI3iasq3DMkrD1lbrxc",
      "is_app_unfurl": false,
      "response_url": "https://hooks.slack.com/actions/TCRCVH6BG/494343009206/NbTWqTYHHm92GaVs1ksSBh7U",
      "trigger_id": "493140943557.433437584390.3e630d6e30a48ce8ae49da1d76d6c6dd"
      }
   */
  //save scrum settings
    if ("confirm_scrum" == event.callback_id)
    {
      try {
        let scrum = { scrumID : event.channel.id, teamID: event.team.id, channelName : event.channel.name, timeConfig : actions[0].value}
        let result = await data.scrums.put(scrum)
        // console.log(JSON.stringify(result, null, 2))
        callback(null, {text:'saved'})    
      } catch (error) {
        // console.log(JSON.stringify(error, null, 2))
        callback(null, {text:'error saving. ' + JSON.stringify(event, null, 2)})
      }
    } 
}
