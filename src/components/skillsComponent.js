import { SKILL_LIST } from '../consts'

export const SkillsComponent = (props) =>{

    let { skillScoreObject,decreaseSkillScore , attributeState, increaseSkillScore, totalAvailableScore } = props

    return (
        <div>
        <p>Total Points Available :  {totalAvailableScore}</p>
        {
            SKILL_LIST.map((skill, index) =>{
                return (
                    <div key={index}>
                        <div className="row">
                            <div className="col-lg-6">
                                {skill.name} : {skillScoreObject[skill.name]} (Modifier : {skill.attributeModifier}) : {attributeState[skill.attributeModifier].mod}
                            </div>
                            <div className="col-lg-6">
                                <div className="row">
                                    <div className='col-lg-4'>
                                        <button onClick={() => increaseSkillScore(skill.name)} className='btn btn-primary'>+</button>
                                    </div>
                                    <div className='col-lg-4'>
                                        <button onClick={() => decreaseSkillScore(skill.name)} className='btn btn-primary'>-</button>
                                    </div>
                                    <div className='col-lg-4'>
                                        <p>Total : {skillScoreObject[skill.name] + attributeState[skill.attributeModifier].mod}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
        }
        </div>
    )
}