import { useEffect, useState } from "react";
import "./App.css";
import { CharacterSheet } from "./components/characterSheet.js";
import { SKILL_LIST, ATTRIBUTE_LIST, CLASS_LIST } from "./consts.js";

function App() {
  const [num, setNum] = useState(1);

  const API_URL = "https://recruiting.verylongdomaintotestwith.ca/api/{jishant07}/character"

  const getCharacterNum = () => {
	return Math.max(...Object.keys(characterObject).map(Number)) + 1
  }

  const getData = async () =>{

	setIsLoading(true)

	let options = {
		method : "GET", 
		headers : {"Content-Type" :"application/json"}
	}
	let result = (await fetch(API_URL, options))
	result = await result.json()
	if(result.statusCode === 200){
		setCharacterObject(result.body)
		setIsLoading(false)
	}	
  }

  useEffect(() =>{
	console.log("IS THIS GETTING CALLED?")
	getData()
  },[])

  const initializeCharacter = (num) => {
	const attributeState = ATTRIBUTE_LIST.reduce((accumulator, attribute) => {
	  //using attribute as id
	  return { ...accumulator, [attribute]: { score: 10, mod: 0 } };
	}, {});
	
	const toggleArray = Object.keys(CLASS_LIST).reduce(
	  (accumulator, classType) => {
		//using classType as id
		return {
		  ...accumulator,
		  [classType]: { canShow: false, achieved: false },
		};
	  },
	  {}
	);

	const skillScoreObject = SKILL_LIST.reduce((accumulator, currentValue) => {
	  return { ...accumulator, [currentValue.name]: 0 };
	}, {});

	const totalAvailableScore = 10 + 4 * attributeState["Intelligence"].mod;

	return {
	  [num]: {
		attributeState,
		toggleArray,
		skillScoreObject,
		totalAvailableScore,
	  },
	};
  };

  const [characterObject, setCharacterObject] = useState(() =>
	initializeCharacter(num)
  );

  const addCharacter = () => {
	setNum(getCharacterNum());
  };

  const [selectedCharacter, setSelectedCharacter] = useState(1);
  const [selectedSkill, setSelectedSkill] = useState({
	name: SKILL_LIST[0].name,
	score: 0,
  });
  const [rollValue, setRollValue] = useState(0);
  const [selectedDC, setSelectedDC] = useState(0);

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
	setCharacterObject((prevState) => {
	  return { ...prevState, ...initializeCharacter(num) };
	});
  }, [num]);

  const deleteCharacterByCharacterId = (characterId) => {
	setCharacterObject((prevState) => {
	  delete prevState[characterId];
	  return { ...prevState };
	});
  };

  const rollFunction = (characterId, selectedSkill, selectedDC) => {
	setSelectedCharacter(characterId);
	setSelectedSkill(selectedSkill);
	setSelectedDC(selectedDC);
	setRollValue(Math.floor(Math.random() * (20 - 1 + 1)) + 1);
  };

  const saveData = async () =>{

	setIsLoading(true)

	let options = {
		method : "POST", 
		body: JSON.stringify(characterObject),
		headers : {"Content-Type" :"application/json"}
	}
	let result = (await fetch(API_URL, options))
	result = await result.json()
	if(result.statusCode === 200){
		setIsLoading(false)
	}
	
  }

  return (
	<div className="App">
	  <header className="App-header">
		<h1>React Coding Exercise</h1>
	  </header>
	  <section className="App-section">
		<button onClick={addCharacter}>Add Character</button>
		<button onClick={saveData}>Save Characters</button>

		<div className="container">
		  <h2>Skill Check Results</h2>

		  <p>Character : {selectedCharacter}</p>
		  <p>
			Skill Selected : {selectedSkill.name} : {selectedSkill.score}
		  </p>
		  <p>You Rolled : {rollValue}</p>
		  <p>The DC was : {selectedDC}</p>
		  <p>
			Result :{" "}
			{selectedSkill.score + rollValue >= selectedDC
			  ? "Success"
			  : "Failure"}
		  </p>
		</div>

		<div>
		  {!isLoading ? Object.keys(characterObject).map((index) => {
			return (
			  <CharacterSheet
				key={index}
				characterId={index}
				deleteCharacterByCharacterId={deleteCharacterByCharacterId}
				characterObject={characterObject}
				// This can further be optimised by using a state management library
				setCharacterObject={setCharacterObject}
				rollFunction={rollFunction}
			  />
			);
		  }) : <h1>Loading...</h1>}
		</div>
	  </section>
	</div>
  );
}

export default App;
