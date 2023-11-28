/*
// Parses a text file containing the virtues and their descriptions and creates an object for each virtue
// Example of text to parse:

ADEPT LABORATORY STUDENT 
Minor, Hermetic 
You digest the instruction of others quite 
easily. You get a +6 bonus to Lab Totals when working from the lab texts of others, including when reinventing spells. 

AFFINITY WITH (ABILITY) 
Minor, General 
All Study Totals for one Ability are 
increased by half, as are any experience points you put in that Ability at character creation. You may only take this Virtue once for a given Ability, but may take it again for different Abilities. If you take this Virtue for an Ability, you may exceed the normal age-based cap during character generation (see page 31) by two points for that Ability. 

AFFINITY WITH (ART) 
Minor, Hermetic 
Your Study Totals for one Hermetic Art 
are increased by one half, rounded up. At character creation, any experience points you put into that Art are also increased by one half (rounded up), and you may exceed the normal recommended limits. You may take this Virtue twice, for two different Arts. 

ANIMAL KEN 
Minor, Supernatural 
    You can communicate with animals as if they were human beings. Choosing this Virtue confers the Ability Animal Ken 1 (page 62). 


*/
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// define virtue class
class Virtue {
	constructor(name, type, description) {
		this.name = name;
		this.type = type;
		this.description = description;
	}
}

// Read the text file
const text = readFileSync('./inputs/virtues.txt', 'utf8');

// Define the regex pattern
const regex = /^[A-Z][A-Z\s()]+\n([\s\S]+?)(?=\n[A-Z][A-Z\s()]+\n|$(?![\r\n]))/gm;

// Split the text into sections
const sections = text.match(regex);

// Remove any empty sections
const nonEmptySections = sections.filter(section => section.trim() !== '');

// Remove excess whitespace from each section
const trimmedSections = nonEmptySections.map(section => section.trim());

let virtueSections = trimmedSections;

// Array to store the parsed virtues
const virtues = [];
console.log(virtueSections.length)
// Iterate over each virtue section
for (const section of virtueSections) {
  // Split the section into lines
  const lines = section.split('\n');

  // Extract the virtue name
  let name = lines[0].trim();
  // capitalise the first letter of each word in the name
  name = name.replace(/(\w)(\w*)/g, (_, first, rest) => first.toUpperCase() + rest.toLowerCase());

  // Extract the virtue type
  const types = lines[1].trim().split(', ');

  // Extract the virtue description
  let description = lines.slice(2).join(' ').trim();
  // Remove any empty lines
  description = description.replace(/^\s*\n/gm, '');
  // Remove any carriage returns
  description = description.replace(/\s*\r\s*/gm, ' ');
  // Remove any lines with just numbers
  description = description.replace(/^\d+\n/gm, '');

  // Create the virtue object
  let virtue = new Virtue(name, types, description);

  // Add the virtue object to the array
  virtues.push(virtue);
}

// // Convert the virtues array to JSON
// const json = JSON.stringify(virtues, null, 2);

// // Save the JSON to a file
// writeFileSync('./output/virtues.json', json, 'utf8');

// Copy the details of each virtue to the already-existing JSON file for that virtue
/* Example of already-existing JSON file for a virtue (this example is named Adept_Laboratory_Student_oIil0LINTtyjWPnj.json):
{
  "name": "Adept Laboratory Student",
  "type": "virtue",
  "img": "systems/arm5e/assets/icons/VF/hermetic.svg",
  "effects": [],
  "flags": {
    "core": {},
    "cf": {
      "id": "temp_nxctmjlqqdb",
      "path": "Virtues#/CF_SEP/Hermetic",
      "color": "#000000"
    }
  },
  "system": {
    "description": "",
    "source": "ArM5",
    "page": 40,
    "type": "hermetic",
    "impact": {
      "value": "minor"
    },
    "indexKey": "adept-laboratory-student"
  },
  "_stats": {
    "systemId": "arm5e",
    "systemVersion": "2.2.2.15",
    "coreVersion": "11.311",
    "createdTime": 1662235751324,
    "modifiedTime": 1696141996181,
    "lastModifiedBy": "1JBSgWiiwizu7vru"
  },
  "folder": "C8jqPqfblXk6hGCE",
  "_id": "oIil0LINTtyjWPnj",
  "sort": 0,
  "ownership": {
    "default": 0,
    "1JBSgWiiwizu7vru": 3
  },
  "_key": "!items!oIil0LINTtyjWPnj"
}
*/
// We just need to match the name and the type of the virtue to the name field in the JSON file, and then copy the description field to the JSON file
// The name field is matched to the name field in the JSON file
// The type field is matched to the system.type field in the JSON file
// The description field is copied to the system.description field in the JSON file
// The name and type fields are used to match the correct JSON file
// The JSON files are in the folder '../unpacked/virtues'



// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the virtues folder
const virtuesFolder = path.join(__dirname, '../unpacked/virtues');
const files = readdirSync(virtuesFolder);

// Iterate over each virtue file
let j = 0;
files.forEach(file => {
  // Increment the indexz
  j++;
  console.log(j)
  const filePath = path.join(virtuesFolder, file);

  try {
    // Read the virtue JSON file
    var virtue = JSON.parse(readFileSync(filePath, 'utf8'));
  
    // Match the name and type of the virtue
    var name = virtue.name;
    var type = virtue.system.type;
    
  } catch (error) {
    console.log(error)
    console.log(filePath)
  }

  // Find the corresponding virtue details
  const virtueDetails = getVirtueDetails(name, type);
  console.log(virtueDetails)

  // Copy the description to the virtue JSON file
  if (virtueDetails) {
    virtue.system.description = virtueDetails;
    writeFileSync(filePath, JSON.stringify(virtue, null, 2), 'utf8');
  }
});

// Function to get the virtue details based on name and type
function getVirtueDetails(name, type) {
  // Return the virtue details object if found, or null if not found
  const virtue = virtues.find(virtue => virtue.name.toLowerCase() === name.toLowerCase() && virtue.type.some(t => t.toLowerCase() === type.toLowerCase()));
  //console.log(virtue)
  return virtue?.description;
}