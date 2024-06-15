import { CLASS_LIST } from "../consts"
import { ClassMinAttributes } from "./classMinAttributes"

export const ClassList = (props) =>{

	let {toggleArray, toggleList} = props

	return (
		<>
		{
			Object.keys(CLASS_LIST).map((characterClass, index) =>{
				return (
					<div key={index}>
						<p 
							onClick={() => toggleList(characterClass)} 
							className={`pointer ${toggleArray[characterClass].achieved ? 'text-success' : 'text-light'}`}>
							{characterClass}
						</p>
						{toggleArray[characterClass].canShow ? <ClassMinAttributes charactersList={CLASS_LIST[characterClass]} /> : null}
					</div>
				)
			})
		}
		</>
	)
}