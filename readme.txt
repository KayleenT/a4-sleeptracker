--Readme document for *author(s)*, *email(s)*, *UCI id(s)*--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?

25 hours

3. What online resources did you consult when completing this assignment? (list specific URLs)

ionic intro - https://youtu.be/iLLXfPwrtj0?si=lgNF01OeA2hDAGKe
ionic app making - https://youtu.be/whnA4Eod3xo?si=-jlU-fci5VZ5d94J
capacitor reference - https://youtu.be/x2jRs7Qqai8?si=x4YozbC9u4v7x5BT
capacitor preferences storage reference - https://capacitorjs.com/docs/apis/preferences


4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

None besides partnership members

5. Is there anything special we need to know in order to run your code?

None

--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?

We designed for a particular user who wants to specifically know how the amount of sleep they are getting correlates to the levels of sleepiness they feel during the day. In doing so, we chose to pair the display of sleep and sleepiness logs together to tie the correlation for the users to view, rather than have two separate logs that hold each type of logging information. 

7. Did you design your app specifically for iOS or Android, or both?

We designed our app for specifically IOS.

8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?

We chose to log overnight sleep by the user entering the start time and stop time of their sleep. We chose to support overnight sleep logging this way instead of using another method such as a button to start sleep at night and stop sleep in the morning because from our observation, people don't always pick up their phone right as they wake, or go to sleep right as they put away their phone, so it made more sense to log it just once correctly to avoid need for correction.

9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?

We have a sleepiness log question on the home page that we designed that asks for the user's sleepiness level from 1-7. We chose to log sleepiness this way because once users are familiar with how to connect their sleepiness level to one of the 1-7 levels, choosing a number from 1-7 is a quick action that they can complete without hassle.

10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?

We implmented a second tab on our app to list the logged data, which lists data by the day with both the amount of sleep and levels of sleepiness logged throughout the day shown together. We chose to support this view of logged data because it encourages correlation drawn between the amount of sleep and sleepiness throughout the day, rather than list them in two separate sections of logging which would make them more of isolated observations that we didn't find to be as valuable to the user.

11. Which feature choose--using a native device resource, backing up logged data, or both?

We did both

12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?

We added a native notification system that allows the user to set a list of set times to send them a reminder notification to log their sleepiness. This changes the app's experience for a user because it encourages regular use in a schedule that is customized to the user's personal life. 

13. If you backed up logged data, where does it back up to?

Logged data is backed up using Capacitor Preferences and uses an iPhone's permanent app storage.

14. How does your app implement or follow principles of good mobile design?

The app follows principles of good mobile design by displaying a good initial view (the app's main functionalities in a self-descriptive way), allowing users to navigate between pages easily and rewrite over incorrect entries, preventing errors by only allowing valid inputs, and following mobile app conventions in style and navigation. 
