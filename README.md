# Little Lemon Food Ordering App

This is a complete Expo React Native submission for the Little Lemon Food Ordering App peer-graded assignment.

## Submission files

- `wireframe.png` - the wireframe image required by the assignment.
- `submission-wireframe.svg` - editable source for the same wireframe.
- `App.js` - the complete app implementation.

## Included requirements

- First-launch onboarding with required name and email fields.
- A **Next** button that remains disabled until both details are valid.
- Persistent onboarding and profile data using AsyncStorage.
- Stack navigation between Home and Profile, including the native Back button.
- Home screen with a header, hero, restaurant description, food photo, search input, menu categories, and a vertically scrollable food list.
- Search and independently selectable Starters, Mains, Desserts, and Drinks category chips.
- Editable Profile screen with saved changes retained after app restart.
- Log out clears saved profile data and returns to onboarding.

## Run locally

```bash
npm install
npm start
```

In Windows PowerShell, use `npm.cmd start` if your execution policy blocks `npm.ps1`. Open the app in Expo Go or press `w` for the web app.

## Reviewer checklist

1. On a fresh launch, confirm that the onboarding screen appears.
2. Enter a name and a valid email: **Next** becomes enabled and opens Home.
3. Open the profile icon: entered details are present. Edit and save any value, reload the app, and confirm it remains saved.
4. Use the native **Back** button to return from Profile to Home.
5. Toggle one or more menu chips and use Search to verify that the food list narrows correctly.
6. Press **Log out** and confirm that onboarding appears again.
