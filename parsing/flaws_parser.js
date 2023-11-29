/*
// Parses a text file containing the flaws and their descriptions and creates an object for each flaw
// Example of text to parse:


ABILITY BLOCK 
Minor, General 
    You are completely unable to learn a certain class of Abilities, for some reason. This may be Martial Abilities, or a more limited set of the others. A profound inability to master logic 	would 	rule 	out 	Artes 	Liberales, Philosophiae, 	any 	Law, 		Medicine, 	and Theology. Alternatively, you might be unable to learn any languages other than your native tongue. It must be possible for your character to learn the abilities in question, but she need have no intention of doing so. You may only take this Flaw once. 

AFFLICTED TONGUE 
Minor, General 
You have a speech impediment, such as a 
lisp, stutter, or missing teeth. You suffer a –2 to all rolls involving the voice. If you are a magus, you must also roll an extra botch die when casting a spell using words. 

AGE QUICKLY 
Major, Supernatural 
    Probably due to a curse or a magical disaster, you age twice as fast as normal people. Your effective age (which applies as if it were your actual age when creating a Longevity Ritual, and when making rolls on the Aging table) increases two years for every year that passes, and you make two aging rolls each year. There is no way to halt or slow this other than Longevity Rituals. 



 
AMBITIOUS 
Major or Minor, Personality 
    You want to be the most successful or powerful person in the world in some respect. You will not be distracted into doing things that do not contribute to your ambition, and are very eager to do things that advance it. 
*/
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// define flaw class
class Flaw {
	constructor(name, type, description) {
		this.name = name;
		this.type = type;
		this.description = description;
	}
}

// Read the text file
const text = readFileSync('./inputs/flaws.txt', 'utf8');

// Define the regex pattern
const regex = /^[A-Z][A-Z\s()\-\*]+\n([\s\S]+?)(?=\n[A-Z][A-Z\s()\-\*]+\n|$(?![\r\n]))/gm;

// Split the text into sections
const sections = text.match(regex);

// Remove any empty sections
const nonEmptySections = sections.filter(section => section.trim() !== '');

// Remove excess whitespace from each section
const trimmedSections = nonEmptySections.map(section => section.trim());

let flawSections = trimmedSections;

// Array to store the parsed flaws
const flaws = [];
console.log(flawSections.length)
// Iterate over each flaw section
for (const section of flawSections) {
  // Split the section into lines
  const lines = section.split('\n');

  // Extract the flaw name
  let name = lines[0].trim();
  // capitalise the first letter of each word in the name
  name = name.replace(/(\w)(\w*)/g, (_, first, rest) => first.toUpperCase() + rest.toLowerCase());

  // Extract the flaw types
  const types = lines[1].trim().split(/, | or | and /);

  // Extract the flaw description
  let description = lines.slice(2).join(' ').trim();
  // Remove any empty lines
  description = description.replace(/^\s*\n/gm, '');
  // Remove any carriage returns
  description = description.replace(/\s*\r\s*/gm, ' ');
  // Replace any tabs with double space
  description = description.replace(/\t/gm, '  ');
  // Remove any lines with just numbers (page numbers)
  description = description.replace(/^\d+\n/gm, '');
  // Remove any lines with 'Ars Magica Fifth Edition' - these are footers
  description = description.replace(/^\s*Ars Magica Fifth Edition\s*$/gm, '');

  // Create the flaw object
  let flaw = new Flaw(name, types, description);

  // Add the flaw object to the array
  flaws.push(flaw);
}

// // Convert the flaws array to JSON
// const json = JSON.stringify(flaws, null, 2);

// // Save the JSON to a file
// writeFileSync('./output/flaws.json', json, 'utf8');

// Copy the details of each flaw to the already-existing JSON file for that flaw
/* Example of already-existing JSON file for a flaw (this example is named Ability_Block_aL5XgJBR5jxV5ZUy.json):
{
  "name": "Ability Block",
  "type": "flaw",
  "img": "systems/arm5e/assets/icons/VF/generalFlaw.svg",
  "effects": [],
  "flags": {
    "core": {},
    "cf": {
      "id": "temp_g1gywhrffo",
      "path": "Flaws#/CF_SEP/General",
      "color": "#000000"
    }
  },
  "system": {
    "description": "",
    "source": "ArM5",
    "page": 51,
    "type": "general",
    "impact": {
      "value": "minor"
    },
    "indexKey": "ability-block"
  },
  "_stats": {
    "systemId": "arm5e",
    "systemVersion": "2.2.2.15",
    "coreVersion": "11.311",
    "createdTime": 1662235751654,
    "modifiedTime": 1696141995032,
    "lastModifiedBy": "1JBSgWiiwizu7vru"
  },
  "folder": "UfPp46NPMX0jIrJv",
  "_id": "aL5XgJBR5jxV5ZUy",
  "sort": 0,
  "ownership": {
    "default": 0,
    "1JBSgWiiwizu7vru": 3
  },
  "_key": "!items!aL5XgJBR5jxV5ZUy"
}

*/
// We just need to match the name and the type of the flaw to the name field in the JSON file, and then copy the description field to the JSON file
// The name field is matched to the name field in the JSON file
// The type field is matched to the system.type field in the JSON file
// The description field is copied to the system.description field in the JSON file
// The name and type fields are used to match the correct JSON file
// The JSON files are in the folder '../unpacked/flaws'



// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the flaws folder
const flawsFolder = path.join(__dirname, '../unpacked/flaws');
const files = readdirSync(flawsFolder);

// Iterate over each flaw file
let j = 0;
files.forEach(file => {
  // Increment the index
  j++;
  console.log(j)
  const filePath = path.join(flawsFolder, file);

  try {
    // Read the flaw JSON file
    var flaw = JSON.parse(readFileSync(filePath, 'utf8'));
  
    // Match the name and type of the flaw
    var name = flaw.name.replace(/\s*\(.*\)\s*/g, '');
    var type = flaw.system.type;
    var impact = flaw.system.impact.value;
    
  } catch (error) {
    console.log(error)
    console.log(filePath)
  }

  // Find the corresponding flaw details
  const flawDetails = getflawDetails(name, type, impact);
  console.log(name, type, impact)

  // Copy the description to the flaw JSON file
  if (flawDetails) {
    flaw.system.description = flawDetails;
    writeFileSync(filePath, JSON.stringify(flaw, null, 2), 'utf8');
  }
});
//console.log(flaws[12])
// Function to get the flaw details based on name and type
function getflawDetails(name, type, impact) {
  // Return the flaw object details property if found, or null if not found
  const flaw = flaws.find(flaw => flaw.name.toLowerCase() === name.toLowerCase() 
    && flaw.type.some(t => t.toLowerCase() === type.toLowerCase())
    && flaw.type.some(t => t.toLowerCase() === impact.toLowerCase()));
  //console.log(flaw)
  return flaw?.description;
}