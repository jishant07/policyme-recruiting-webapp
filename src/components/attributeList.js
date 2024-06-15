export const AttributeList = (props) =>{

    let {attributeState, isAddDisabled, handleDecrease, handleIncrease} = props
    return (
        <>
        {                
            Object.keys(attributeState).map((attribute, index) =>{
                let localState = attributeState[attribute]                
                return (
                    <div key={index}>
                        <div className="row">
                            <div className="col-lg-6">
                                <p>{attribute} : {localState.score}(Modifier : {localState.mod})</p>
                            </div>
                            <div className="col-lg-6">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <button className="btn btn-primary" onClick={()=>{!isAddDisabled && handleIncrease(attribute)}}>+</button>
                                    </div>
                                    <div className="col-lg-6">
                                        <button className="btn btn-primary" onClick={()=>{localState.score > 0 && handleDecrease(attribute)}}>-</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
        }
        </>
    )
}