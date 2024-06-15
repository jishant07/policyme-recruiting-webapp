export const ClassMinAttributes = (props) =>{

	let {charactersList} = props
	return (
		<div>
			<ul className="list-group">
				{
					Object.keys(charactersList).map((character, index) =>{
						return <li key={index} className="list-group-item">{character} : {charactersList[character]}</li>
					})
				}
			</ul>
		</div>
	)
}