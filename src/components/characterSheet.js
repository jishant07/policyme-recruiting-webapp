import { useState, useEffect } from "react";
import { ClassList } from "./classList";
import { AttributeList } from "./attributeList";
import { SkillsComponent } from "./skillsComponent";
import { SKILL_LIST, CLASS_LIST } from "../consts.js";

export const CharacterSheet = (props) => {
  let {
	characterId,
	deleteCharacterByCharacterId,
	characterObject,
	setCharacterObject,
	rollFunction,
  } = props;

  const [attributeState, setAttributeState] = useState(
	characterObject[characterId].attributeState
  );

  const [toggleArray, setToggleArray] = useState(
	characterObject[characterId].toggleArray
  );

  const [skillScoreObject, setSkillScoreObject] = useState(
	characterObject[characterId].skillScoreObject
  );

  const returnTotalScore = (intelligenceModifier) =>
	10 + 4 * intelligenceModifier;
  const [totalAvailableScore, setTotalAvailableScore] = useState(
	returnTotalScore(attributeState["Intelligence"].mod)
  );

  const toggleList = (classType) => {
	setToggleArray((prevState) => {
	  return {
		...prevState,
		[classType]: {
		  ...prevState[classType],
		  canShow: !prevState[classType].canShow,
		},
	  };
	});
  };

  const [isAddDisabled, setIsAddDisabled] = useState(false);

  const checkMax = () => {
	let sum = Object.keys(attributeState).reduce((acc, cur) => {
	  return acc + attributeState[cur].score;
	}, 0);
	if (sum === 70) {
	  setIsAddDisabled(true);
	} else {
	  setIsAddDisabled(false);
	}
	return sum;
  };

  const handleIncrease = (attribute) => {
	let addFactor = 0;
	if (attributeState[attribute].score >= 10) {
	  addFactor = (attributeState[attribute].score + 1) % 2 === 0 ? 1 : 0;
	} else {
	  addFactor = 1;
	}
	if (checkMax() !== 70) {
	  setAttributeState((prevState) => {
		return {
		  ...prevState,
		  [attribute]: {
			...prevState[attribute],
			mod: prevState[attribute].mod + addFactor,
			score: prevState[attribute].score + 1,
		  },
		};
	  });
	} else {
	  alert("Maximum Score Reached, reduce others to increase");
	}
  };

  const handleDecrease = (attribute) => {
	let subFactor = 0;
	if (attributeState[attribute].score >= 10) {
	  subFactor = (attributeState[attribute].score - 1) % 2 === 0 ? 1 : 0;
	} else {
	  subFactor = 1;
	}
	if (attributeState[attribute].score > 0) {
	  setAttributeState((prevState) => {
		return {
		  ...prevState,
		  [attribute]: {
			...prevState[attribute],
			mod: prevState[attribute].mod - subFactor,
			score: prevState[attribute].score - 1,
		  },
		};
	  });
	}
	checkMax();
  };

  useEffect(() => {
	let scoreMap = {};
	Object.keys(attributeState).forEach((attribute) => {
	  scoreMap[attribute] = attributeState[attribute].score;
	});
	let scoreObjectKeys = Object.keys(scoreMap);

	let updateObject = Object.keys(CLASS_LIST).reduce(
	  (accumulator, currentValue) => {
		return { ...accumulator, [currentValue]: [] };
	  },
	  {}
	);
	Object.keys(CLASS_LIST).forEach((classType) => {
	  scoreObjectKeys.forEach((keys) => {
		if (scoreMap[keys] >= CLASS_LIST[classType][keys])
		  updateObject[classType].push(keys);
	  });
	  setToggleArray((prevState) => {
		return {
		  ...prevState,
		  [classType]: {
			...prevState[classType],
			achieved: updateObject[classType].length === scoreObjectKeys.length,
		  },
		};
	  });
	});

	setTotalAvailableScore(() =>
	  returnTotalScore(attributeState["Intelligence"].mod)
	);
  }, [attributeState]);

  // Keeping states in sync with parent component
  useEffect(() => {
	setCharacterObject((prevState) => {
	  return {
		...prevState,
		[characterId]: { ...prevState[characterId], attributeState },
	  };
	});
  }, [attributeState, characterId, setCharacterObject]);

  useEffect(() => {
	setCharacterObject((prevState) => {
	  return {
		...prevState,
		[characterId]: { ...prevState[characterId], toggleArray },
	  };
	});
  }, [characterId, setCharacterObject, toggleArray]);

  useEffect(() => {
	setCharacterObject((prevState) => {
	  return {
		...prevState,
		[characterId]: { ...prevState[characterId], skillScoreObject },
	  };
	});
  }, [skillScoreObject, characterId, setCharacterObject]);

  useEffect(() => {
	setCharacterObject((prevState) => {
	  return {
		...prevState,
		[characterId]: { ...prevState[characterId], totalAvailableScore },
	  };
	});
  }, [skillScoreObject, characterId, totalAvailableScore, setCharacterObject]);

  const increaseSkillScore = (skillName) => {
	if (!(totalAvailableScore <= checkSkillTotal())) {
	  setSkillScoreObject((prevState) => {
		return { ...prevState, [skillName]: prevState[skillName] + 1 };
	  });
	} else {
	  alert("Skills Total Reached");
	}
  };

  const decreaseSkillScore = (skillName) => {
	setSkillScoreObject((prevState) => {
	  return {
		...prevState,
		[skillName]:
		  prevState[skillName] > 0
			? prevState[skillName] - 1
			: prevState[skillName],
	  };
	});
  };

  const checkSkillTotal = () => {
	return SKILL_LIST.reduce((accumulator, currentValue) => {
	  return (
		accumulator +
		skillScoreObject[currentValue.name] +
		attributeState[currentValue.attributeModifier].mod
	  );
	}, 0);
  };

  const [selectedSkill, setSelectedSkill] = useState(SKILL_LIST[0].name);
  const [dc, setDC] = useState(20);

  const handleSkillChange = (e) => {
	setSelectedSkill(e.target.value);
  };
  const handleDCChange = (e) => {
	setDC(e.target.value);
  };

  return (
	<>
	  <div className="container character-sheet mx-auto">
		<h1>Character : {characterId}</h1>
		<div className="d-flex justify-content-start">
		  <button
			className="btn btn-danger text-center col-3"
			onClick={() => deleteCharacterByCharacterId(characterId)}
		  >
			Delete Character
		  </button>
		</div>
		<div className="row">
		  <div className="jumbotron">
			<h2>Skill Check</h2>
			<div className="row">
			  <div className="col-lg-4">
				<label style={{ marginRight: "10px" }}>Skill:</label>
				<select
				  name="skills_select"
				  defaultValue={SKILL_LIST[0].name}
				  onChange={(e) => {
					handleSkillChange(e);
				  }}
				>
				  {SKILL_LIST.map((skill, index) => {
					return (
					  <option key={index} value={skill.name}>
						{skill.name}
					  </option>
					);
				  })}
				</select>
			  </div>
			  <div className="col-lg-4">
				<label style={{ marginRight: "10px" }}>DC:</label>
				<input
				  type="number"
				  name="dc"
				  defaultValue={dc}
				  onChange={(e) => {
					handleDCChange();
				  }}
				/>
			  </div>
			  <div className="col-lg-4">
				<button
				  className="btn btn-primary"
				  onClick={() =>
					rollFunction(
					  characterId,
					  {
						name: selectedSkill,
						score: skillScoreObject[selectedSkill],
					  },
					  dc
					)
				  }
				>
				  Roll
				</button>
			  </div>
			</div>
		  </div>
		</div>
		<div className="row">
		  <div className="col-lg-3">
			<h2 className="text-center">Attributes</h2>
			<AttributeList
			  attributeState={attributeState}
			  isAddDisabled={isAddDisabled}
			  handleIncrease={handleIncrease}
			  handleDecrease={handleDecrease}
			/>
		  </div>
		  <div className="col-lg-3">
			<h2 className="text-center">Classes</h2>
			<p className="text-danger">
			  NOTE: Toggle Requirements List by clicking the class
			</p>
			<ClassList toggleArray={toggleArray} toggleList={toggleList} />
		  </div>
		  <div className="col-lg-6">
			<h2 className="text-center">Skills</h2>
			<SkillsComponent
			  increaseSkillScore={increaseSkillScore}
			  decreaseSkillScore={decreaseSkillScore}
			  skillScoreObject={skillScoreObject}
			  attributeState={attributeState}
			  totalAvailableScore={totalAvailableScore}
			/>
		  </div>
		</div>
	  </div>
	</>
  );
};
