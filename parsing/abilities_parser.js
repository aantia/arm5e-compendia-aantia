/*
// Parses a text file containing the abilities and their descriptions and creates an object for each ability
// Example of text to parse:



(AREA) LORE* 
Knowledge of one particular region, 
covenant, or even a village. It includes knowing where things are in the immediate area, local history and legends, and the centers of power in the region. The smaller the region, the more detailed your knowledge. Specialties: geography, history, legends, politics, personalities. (General) 
ANIMAL HANDLING 
Care and use of animals, including raising, 
tending, 	grooming, 	and 	healing 	them. Specialties:	falconry, 	specific 	animals. (General) 
ANIMAL KEN 
You can communicate with animals as if 
they were human beings. Treat your score in Animal Ken as your score in a language that the animal speaks fluently in order to determine how well you can communicate, and you can use Animal Handling as a substitute for any social abilities affecting humans. Beyond this, this virtue has no effect on the attitude of animals to you, or you to animals. Other people cannot understand your communication with the animals. Specialties: a particular type of animal, a particular type of communication. (Supernatural) 


*/
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// define ability class
class Ability {
	constructor(name, description) {
		this.name = name;
		this.description = description;
	}
}

// Read the text file
const text = readFileSync('./inputs/abilities.txt', 'utf8');

// Define the regex pattern
const regex = /^[A-Z][A-Z\s()-\*]+\n([\s\S]+?)(?=\n[A-Z][A-Z\s()-\*]+\n|$(?![\r\n]))/gm;

// Split the text into sections
const sections = text.match(regex);

// Remove any empty sections
const nonEmptySections = sections.filter(section => section.trim() !== '');

// Remove excess whitespace from each section
const trimmedSections = nonEmptySections.map(section => section.trim());

let abilitiesections = trimmedSections;

// Array to store the parsed abilities
const abilities = [];
console.log(abilitiesections.length)
// Iterate over each ability section
for (const section of abilitiesections) {
  // Split the section into lines
  const lines = section.split('\n');

  // Extract the ability name
  let name = lines[0].trim();
  // capitalise the first letter of each word in the name
  name = name.replace(/(\w)(\w*)/g, (_, first, rest) => first.toUpperCase() + rest.toLowerCase());

  // Extract the ability description
  let description = lines.slice(1).join(' ').trim();
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
  // Insert a new line before the word 'Specialties'
  description = description.replace(/Specialties/gm, '\nSpecialties');

  // Create the ability object
  let ability = new Ability(name, description);

  // Add the ability object to the array
  abilities.push(ability);
}

// // Convert the abilities array to JSON
// const json = JSON.stringify(abilities, null, 2);

// // Save the JSON to a file
// writeFileSync('./output/abilities.json', json, 'utf8');

// Copy the details of each ability to the already-existing JSON file for that ability
/* Example of already-existing JSON file for a ability (this example is named Ability_Block_aL5XgJBR5jxV5ZUy.json):
{
  "name": "Artes Liberales*",
  "type": "ability",
  "img": "systems/arm5e/assets/icons/abilities/artesLib.svg",
  "effects": [],
  "flags": {
    "core": {},
    "cf": {
      "id": "temp_5d6v8nsyfy",
      "path": "Abilities#/CF_SEP/Academic",
      "color": "#000000"
    }
  },
  "system": {
    "description": "",
    "source": "ArM5",
    "page": 62,
    "defaultChaAb": "int",
    "speciality": "",
    "xp": 0,
    "key": "artesLib",
    "option": "",
    "realm": "magic",
    "indexKey": "artes-liberales"
  },
  "_stats": {
    "systemId": "arm5e",
    "systemVersion": "2.2.2.19",
    "coreVersion": "11.311",
    "createdTime": 1662235751941,
    "modifiedTime": 1696597048288,
    "lastModifiedBy": "1JBSgWiiwizu7vru"
  },
  "folder": "RFwx3qCrd6CJ4GDo",
  "_id": "GhxO6KomdJ7lO7qc",
  "sort": 600000,
  "ownership": {
    "default": 0,
    "1JBSgWiiwizu7vru": 3
  },
  "_key": "!items!GhxO6KomdJ7lO7qc"
}

*/
// We just need to match the name of the ability to the name field in the JSON file, and then copy the description field to the JSON file
// The name field is matched to the name field in the JSON file
// The description field is copied to the system.description field in the JSON file
// The JSON files are in the folder '../unpacked/abilities'



// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the abilities folder
const abilitiesFolder = path.join(__dirname, '../unpacked/abilities');
const files = readdirSync(abilitiesFolder);

// Iterate over each ability file
let j = 0;
files.forEach(file => {
  // Increment the index
  j++;
  console.log(j)
  const filePath = path.join(abilitiesFolder, file);

  try {
    // Read the ability JSON file
    var ability = JSON.parse(readFileSync(filePath, 'utf8'));
  
    // Match the name of the ability
    var name = ability.name.replace(/\s*\(.*\)\s*/g, '');
    
  } catch (error) {
    console.log(error)
    console.log(filePath)
  }

  // Find the corresponding ability details
  const abilityDetails = getabilityDetails(name);
  console.log(name)

  // Copy the description to the ability JSON file
  if (abilityDetails) {
    ability.system.description = abilityDetails;
    writeFileSync(filePath, JSON.stringify(ability, null, 2), 'utf8');
  }
});
console.log(abilities[1])
// Function to get the ability details based on name
function getabilityDetails(name) {
  // Return the ability object details property if found, or null if not found
  const ability = abilities.find(ability => ability.name.toLowerCase().replace('*', '').trim() === name.toLowerCase().replace('*', '').trim());
  console.log(ability)
  return ability?.description;
}