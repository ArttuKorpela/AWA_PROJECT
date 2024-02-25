

Advanced Web Applications \
Arttu Korpela #xxxxxx \

Documentation for Arttu’s dating app

22.1.2024


# **Backend design**


---

**1.1 Technologies used**

The backend for this project will be composed of Node.js, Express, and MongoDB. Node.js and Express provide all the functionality, great package selection for features, and are relatively easy to develop with. MongoDB is used along with Mongoose due to my familiarity with it and our need for fast data transfer and scalability. A NoSQL solution will fill these needs. \
**1.2 Database design**

For now, we will have four models User, Likes, Match, and Chat. Below is an illustration of how these will be connected:

![Advanced Web Applications Harkkatyö](https://github.com/ArttuKorpela/AWA_PROJECT/assets/122992707/6044b5a2-dc9c-49fc-9a19-8e857e81033a)



**Frontend design**

---


**2.1 UI design**

We’ll be using the Material React library due to its ease of use and flexibility. Also, a popular component library will make the page look and feel familiar to the user. 


![Screenshot 2024-01-24 004239](https://github.com/ArttuKorpela/AWA_PROJECT/assets/122992707/b201dc9a-47c0-40e9-bb57-53a530af2f9c)


# **Testing**


---

Cypress tests:


<table>
  <tr>
   <td>Test Description
   </td>
   <td>Expectation
   </td>
   <td>Result
   </td>
  </tr>
  <tr>
   <td>Loads the page
   </td>
   <td>The login and register components should be visible.
   </td>
   <td>Pass
   </td>
  </tr>
  <tr>
   <td>Load the login
   </td>
   <td>The login card should be accessible.
   </td>
   <td>Pass
   </td>
  </tr>
  <tr>
   <td>Change to register
   </td>
   <td>The register card should be visible after clicking the register button.
   </td>
   <td>Pass
   </td>
  </tr>
  <tr>
   <td>Try to log in without credentials
   </td>
   <td>Should display an error message indicating "Incorrect Email" because the credentials are invalid.
   </td>
   <td>Pass
   </td>
  </tr>
  <tr>
   <td>Create a new account
   </td>
   <td>After successful account creation, the login card should be visible indicating a switch to login.
   </td>
   <td>Pass
   </td>
  </tr>
  <tr>
   <td>Try to login with an incorrect password
   </td>
   <td>Should indicate that the password is incorrect.
   </td>
   <td>Pass
   </td>
  </tr>
  <tr>
   <td>Successfully login with the correct email and password
   </td>
   <td>The home card should be visible upon successful login.
   </td>
   <td>Pass
   </td>
  </tr>
  <tr>
   <td>Should remember login info
   </td>
   <td>After refreshing the page, the home card should still be visible indicating session persistence.
   </td>
   <td>Pass
   </td>
  </tr>
  <tr>
   <td>Should not be able to see the screen if token is deleted
   </td>
   <td>After deleting the token and reloading, the login and register components should be visible.
   </td>
   <td>Pass
   </td>
  </tr>
  <tr>
   <td>User Deletion Test
   </td>
   <td>Should successfully delete the user and not let the user login after
   </td>
   <td>Pass
   </td>
  </tr>
</table>


Accessibility testing was done using two screenreaders Windows Narrator and NVDA version 2023.3.3 as these were the most popular options. Also testing includes for color blindness accessibility. We are using Color Oracle to simulate the three most common types of color blindness: Deutrenaropia, Protanopia and Tritanopia.


<table>
  <tr>
   <td>Test Description
   </td>
   <td>Expectation
   </td>
   <td>Result
   </td>
  </tr>
  <tr>
   <td>Users can use Windows Narrator to navigate the app
   </td>
   <td>Users can easily navigate the app.
   </td>
   <td>Fail
   </td>
  </tr>
  <tr>
   <td>Users can use NVDA to navigate the app
   </td>
   <td>Users can easily navigate the app.
   </td>
   <td>Pass
   </td>
  </tr>
  <tr>
   <td>Like, updating profile, and commenting while having colorblindness works
   </td>
   <td>Users with Deutrenaropia can use the app normally
   </td>
   <td>Pass
   </td>
  </tr>
  <tr>
   <td>Like, updating profile, and commenting while having colorblindness works
   </td>
   <td>Users with Protanopia can use the app normally
   </td>
   <td>Pass
   </td>
  </tr>
  <tr>
   <td>Like, updating profile, and commenting while having colorblindness works
   </td>
   <td>Users with Tritanopia can use the app normally
   </td>
   <td>Pass
   </td>
  </tr>
</table>


Results of testing indicate that there is work to be done to get Windows Narrator working. The Narrator only says the text after clicking the button. NVDA worked much better as it read all the text visible on the page correctly. The UI consists of mostly high-contrast colors so there were no issues with any of the colorblindness tests.

**Setup**

---


Once the project is opened and all node modules are installed the app can be launched in development or production mode.  \
 \
1.set  NODE_ENV = development

2. npm run dev:server (localhost:5000)

3.  npm run dev:client (localhost:3000)

or 

1.set  NODE_ENV = production

2. npm run build

3.  npm run dev:server (localhost:5000)

**What I would do differently the next time? **

---


The app is too front heavy and there are a lot of states passed back and forth. Next time I would move almost all logic to the backend. Also, there are major pains caused by the single-page app design that could be avoided just by having multiple URLs. There are major safety concerns so I would spend a lot more time refining the cybersecurity side this project was mainly just to learn more about React and web applications overall.

**Points**

---



<table>
  <tr>
   <td><strong>Feature</strong>
   </td>
   <td><strong>Implementation</strong>
   </td>
   <td><strong>Points</strong>
   </td>
   <td><strong>Max points</strong>
   </td>
  </tr>
  <tr>
   <td>Basic features (as stated in the previous chapter)  with well written documentation
   </td>
   <td>All featurer added
   </td>
   <td>25
   </td>
   <td>25
   </td>
  </tr>
  <tr>
   <td>Utilization of a frontside framework, such as React, but you can also use Angular, Vue or some other
   </td>
   <td>Front-end is 100% React.
   </td>
   <td>5
   </td>
   <td>5
   </td>
  </tr>
  <tr>
   <td>Test software for accessibility; can it be used only with keyboard / voice command? Can screen readers work with your application?
   </td>
   <td>Tested accessibility for eyesight impaired.
   </td>
   <td>3
   </td>
   <td>3
   </td>
  </tr>
  <tr>
   <td>If match is being found the UI gives option to start chat immediately
   </td>
   <td>Implemented
   </td>
   <td>2
   </td>
   <td>2
   </td>
  </tr>
  <tr>
   <td>User profiles can have images which are shown on the main page and in the chat
   </td>
   <td>Images can be uploaded and changed
   </td>
   <td>3
   </td>
   <td>3
   </td>
  </tr>
  <tr>
   <td>User can click username and see user profile page where name, register date, (user picture) and user bio is listed
   </td>
   <td>Click username
   </td>
   <td>2
   </td>
   <td>2
   </td>
  </tr>
  <tr>
   <td>Last edited timestamp is stored and shown within chat
   </td>
   <td>Yes.
   </td>
   <td>2
   </td>
   <td>2
   </td>
  </tr>
  <tr>
   <td>Create (unit) tests and automate some testing for example with <a href="https://www.cypress.io/">https://www.cypress.io/</a> (at least 10 cases have to be implemented)
   </td>
   <td>ten test cases automated using cypress
   </td>
   <td>5
   </td>
   <td>5
   </td>
  </tr>
  <tr>
   <td>Single-page application
   </td>
   <td>The entire app is behind a single URL
   </td>
   <td>3
   </td>
   <td>3
   </td>
  </tr>
  <tr>
   <td>Figma to design UI
   </td>
   <td>Figma was used to design the UI before implementation
   </td>
   <td>2
   </td>
   <td>2
   </td>
  </tr>
</table>
