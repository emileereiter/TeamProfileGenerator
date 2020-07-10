const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

async function start(){
    console.log("Let's make your Dream Team!");

    // Set Variable to hold HTML
    let teamHTML = "";

    // Variable to hold number of team members
    let teamSize;

    // First Question to ask to set up loop
    await inquirer.prompt(
        {
            type: "number",
            message: "How many people are in your team?",
            name: "noOfTeamMem"
        }
    )
    .then((data) => {

        // Number of team members placed in teamSize for scope purposes.
        teamSize = data.noOfTeamMem + 1;
    });
    
    // If Team Size is 0, will end program
    if (teamSize === 0){
        console.log("I guess there is no one on your team...");
        return;
    }
    
    // Loop begins to ask questions depending on the size of the team
    for(i = 1; i < teamSize; i++){

        // Global variables set
        let name;
        let id;
        let title;
        let email;

        // Prompts user to answer the basic questions of the employee
        await inquirer.prompt([ 
            {
                type: "input",
                message: `What is employee (${i})'s name?`,
                name: "name"
            },
            {
                type: "input",
                message: `What is the employee (${i})'s id?`,
                name: "id"
            },
            {
                type: "input",
                message: `What is the employee (${i})'s Email?`,
                name: "email"
            },
            {
                type: "list",
                message: `what the employee (${i})'s title?`,
                name: "title",
                choices: ["Engineer", "Intern", "Manager"]
            }
        ])
        .then((data) => {

            // Takes data from user and places value in global variables
            name = data.name;
            id = data.id;
            title = data.title;
            email = data.email;
        });

        // use Switch Case method 
        switch (title){
            case "Manager":

                // ask user of Manager's Office Number
                await inquirer.prompt([
                    {
                        type: "input",
                        message: "What is your Manager's Office Number?",
                        name: "officeNo"
                    }
                ])
                .then((data) => {

                    // Creating an object with all avaiable user input data
                    const manager = new Manager(name, id, email, data.officeNo);

                    // Reads and places HTML from manager.html in teamMemever Variable
                    teamMember = fs.readFileSync("templates/manager.html");

                    // Uses eval() to pass template literals from html files.
                    // Adds the string to the team HTML.
                    teamHTML = teamHTML + "\n" + eval('`'+ teamMember +'`');
                });
                break;

            //Steps Similar to Manager but for intern
            case "Intern":
                await inquirer.prompt([
                    {
                        type: "input",
                        message: "What school is your Intern attending?",
                        name: "school"
                    }
                ])
                .then((data) => {
                    const intern = new Intern(name, id, email, data.school);
                    teamMember = fs.readFileSync("templates/intern.html");
                    teamHTML = teamHTML + "\n" + eval('`'+ teamMember +'`');
                });
                break;

            //Steps Similar to Manager but for engineer
            case "Engineer":
                await inquirer.prompt([
                    {
                        type: "input",
                        message: "What is your Engineer's GitHub?",
                        name: "github"
                    }
                ])
                .then((data) => {
                    const engineer = new Engineer(name, id, email, data.github);
                    teamMember = fs.readFileSync("templates/engineer.html");
                    teamHTML = teamHTML + "\n" + eval('`'+ teamMember +'`');
                });
                break;

        } 

    } 

    // Reads main.html and places html in a variable
    const mainHTML = fs.readFileSync("templates/main.html");
    
    // Use eval to implement template literals in main.html and places teamHTML inside main template
    teamHTML = eval('`'+ mainHTML +'`');

    // write file to new team.html file
    fs.writeFile("output/team.html", teamHTML, function(err) {

        if (err) {
          return console.log(err);
        }
      
        console.log("Success!");
      
      });

    // console.log(teamHTML);
}


start();
