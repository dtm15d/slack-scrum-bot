# slack-scrum-bot
Slack SCRUM Bot


## Objective
The objective of this tool is to allow for management of the SCRUM ceremony of the Agile Development process.
The following instructions indicate how to deploy SCRUM Bot by Club Win.

## What is SCRUM?

SCRUM is the daily ceremony that requires each team member to provide their daily update.

1. What did I did yesterday?
2. What I am doing today?
3. Any roadblocks or obstacles?

This allows team members to help each other and improve collaboration. Additionally, team leads can use this meeting to prevent developers from wasting time by helping reprioritize and solve blockers.

# Deploying This Bot

## Prerequisites:
* AWS Account 
** Full access to Lambda, API Gateway, DynamoDB
* Configure AWS CLI
  * https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html
* Active Slack Team
  * With permissions to build and deploy apps.
* Locally installed:
  * Node 8.10.x 
  * NPM 6.0.x locally 

## Setting up Code:
* Check out a local copy of slack-scrum-bot (this repo)

## Start Deploying App:
1) Run `npm run create` in terminal or command line under lambda directory
   
   a) This will provision the following:
   
       i. DynamoDB
       - Table: scrums - store each scrum that runs
       - Table: scrumResponses - store each response associated with a SCRUM by each user

       ii. API Gateway
        - This exposes lambda externally to the world. This will set up production and staging environments.

       iii. Lambda
        - This will deploy our lambda functions for handling slash commands and interactive actions

2) Run `npm run deploy` in terminal or command line under lambda directory

   * Compile and deploy the latest code to lambda.
   * `Note`: copy the endpoint that is printed out the the console. This is need to configure Slack.
       - Sample: https://abc123.execute-api.us-east-1.amazonaws.com/staging
       - This will be referred to as API_BASE_URL

## Configure Slack App:
1) Open Slack: https://api.slack.com/apps
2) Select Create `New App`
3) Set App Name (ie SCRUM Bot)
4) Choose your workspace: (ie club win)
5) Setting up Slash Commands:
 * Select `Slash Commands` under `Features`
 * Click `Create New Command`
 * Set command (ie /scrumbot)
 * Set Request URL:
 * Value = API_BASE_URL + “/bot/slash”
 * Provide Descript (ie “manage your teams daily SCRUM”)
 * Click `Save`
6) Setting up Interactive Components:
 * Select `Interactive Components` under `Features`
 * Turn `Interactivity` to `On`
 * Set `Request URL`
   * Value = `API_BASE_URL` + “/bot/actions”
 * Click `Save Changes`

## Authorizing App:
1) Select `Oauth & Permissions` under `Features`
 * Add the following scopes
   * chat:write:bot
   * channels:read
   * groups:read
 * Click `Save Changes`
2) Click `Install App to Workspace`
 * Click `Authorize`
3) Copy the value of `OAuth Access Token`
 * This will be referred to as `ACCESS_TOKEN`

## Finish Deploying App:
1) Update token config with the previous value from Slack
 * Open file `lambda/src/shared/scrumbot.js`
 * Replace `123` with `ACCESS_TOKEN`
 * Run `npm run deploy` in terminal or command line under lambda directory

## Using Slack Bot:
1) Open your slack workspace to your teams channel for slack.
2) Run `/scrumbot run`
3) Press start to start interviewing for SCRUM.
4) Each user is message privately in the channel to provide an update
5) Run `/scrumbot print` to print the last scrum
6) When complete the bot will automatically print the complete report.





## More info

### Reference 
 * https://arc.codes/quickstart
 * https://www.npmjs.com/package/slack

### Table: *scrums*
Table for our scrums
* scrumID - uniquid for scrum
* channelId - channel reference for slack
* dayOfWeek - days of week for scrum
* timeOfDay - time of day for scrum

### Table: scrumResponses
* responseId - for each response from a user
* scrumsId - ref to scrum group
* userId - slack user ref
* update { yesterday, today, blockers }