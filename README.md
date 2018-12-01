# slack-scrum-bot
Slack SCRUM Bot


## Objective
The ob jective of this tool is to allow for management of the SCRUM ceramonie of the Agile Development process.

## What is SCRUM?

SCRUM is the daily ceramony that requires each team member to provide their daily update.

1. What did I did yesterday?
2. What I am doing today?
3. Any roadblocks or obstacles?

This allows team members to help eachother and improve collaborationl. Additional the team leads can use this meeting to prevent developers from wasting time by helping repriotize and solve blockers.

# Deploying This Bot

## Requirements
1) Amazon Web Services Acccount

## Setting up Database

### Database: Dyanmo DB Tables
For cost and considering this is a single team use case we are using DynamoDb.
You could also use SQL based system.

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

### IAM Role Configuration - User

#### User
AWS Permissions required for user create initial app.

1) iam:create
2) lambda:*
3) apigateway:*

# App Setup

## Arc Documentation (Background)
https://arc.codes/quickstart/install
"The simplest, most powerful way to build serverless applications"
Arc allows use to focus on the application and builds out the lambda configuration for slack quickly.

### Getting started with Arc
https://arc.codes/quickstart

### Building Application

1) cd scrumbot
2) Ensure you have configured aws credentials (https://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html)
3) npm run create 
 * provision Lambda, api gateway for staging and production endpoints 
 * call this when adding new methods or first time
4) npm run deploy
 * deployes latest code to previously privisioned lambda functions.
 * You only need to call this to deploy changes
5) Note URL

## Configuring Slack

1) Open https://api.slack.com/
2) Select Your Apps
3) Create an App
4) Set App Name (SCRUM Bot) and Workspace for development

### Setup Slash Commands
1) Select "Slash Commands" and "Create new Command"
2) Set "command" = "scrumbot
3) set "Request URL" = [base-url printed during deploy] + "/bot/slash"
4) Add description "configure scrum"

### Setp Interactive Components
1) Select "Interactive Components"
2) Enable
3) Set "Request URL" = [base-url printed during deploy] + "/bot/actions"
4) Save Changes

### Create Bot User
1) Select "Bot Users"
2) Enable bot.

### Deploy to your Workspace
1) Select "Basic Information"
2) Select "Install in your Workspace" and authorize.


## Configuring your first SCRUM
1) Open Slack channel for SCRUM Team
2) enter command /scrumbot setup
3) follow prompts


# IAM Role Configuration - User

#### Lambda
This allows our lambda to read/write to DynamoDB.

1) Open IAM, Select Roles
2) Set service to use role as Lambda
3) Attach the following policies:
  * "AWSLambdaBasicExecutionRole"
  * "AmazonDynamoDBFullAccess"
4) Set name to "slack_bot"
5) Select Create Role.


## How to use
1) Open team channel
2) Configur SCRUM via `/scrumbot setup 09:00 GMT-0400`
   * you must include UTC offset as above
   * time is in military time.


//TODO save Updates and message report.

3) M-F at time configured each user will be messaged for their updates
4) 10 minutes after SCRUM report will be slacked to channel.