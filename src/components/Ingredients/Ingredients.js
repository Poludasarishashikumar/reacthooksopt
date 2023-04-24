import React, { useCallback, useEffect, useReducer} from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import ErrModal from '../UI/ErrorModal';

const ingredientReducer=(currentIngredients,action)=>{
switch(action.type){
  case 'SET':
    return action.ingredients;
  case 'ADD':
    return [...currentIngredients,action.ingredient];
  case 'DELETE':
    return currentIngredients.filter(ing=>ing.id !==action.id);
  default:
    throw new Error('Should not get there!');
}
}

const httpReducer=(currHttpState,action)=>{
  switch(action.type){
    case 'SEND':
      return {loading :true ,error:null};
    case 'RESPONSE':
      return {...currHttpState,loading:false}
    case 'ERROR':
      return {loading:false,error:action.errorMessage};
    default:
      throw new Error('Should not be reached!');
  }
}
function Ingredients() {
  const [userIngredients,dispatch]=useReducer(ingredientReducer,[]);
  const [httpState,dispatchHttp]=useReducer(httpReducer,{loading:false,error:null})
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading,setIsloading]=useState(false);
  // const [error,setError]=useState();
  // useEffect(()=>{

  //   fetch('https://react-hooks-update-75dee-default-rtdb.firebaseio.com/ingredients.json').then(
  //     response=>response.json()).then(
  //       responseData=>{
  //         const loadedIngredients=[];
  //         for(const key in responseData)
  //         {
  //           loadedIngredients.push({
  //             id:key,
  //             title:responseData[key].title,
  //             amount:responseData[key].amount
  //           })
  //         }
  //         // setUserIngredients(loadedIngredients);
  //       }
  //     );
  // },[]);

  const filteredIngredientshandler=useCallback( filteredIngredients=>{
    // setUserIngredients(filteredIngredients);
    dispatch({type:'SET',ingredients:filteredIngredients});
  },[]);
 
  const removeIngredientHandler=ingredientId=>{
    dispatchHttp({type:'SEND'});
    fetch(`https://react-hooks-update-75dee-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,{
      method:'DELETE',
    
      
    }).then(response=>{
      dispatchHttp({type:'RESPONSE'});
      // setUserIngredients(prevIngredients => 
      //   prevIngredients.filter(ingredient=>ingredient.id !==ingredientId)
      // );
      dispatch({type:'DELETE',id:ingredientId})
    }).catch(error=>{
      dispatchHttp({type:'ERROR',errorMessage:'Something went wrong!'});
    })
  }

  

  const addIngredientHandler = (ingredient) => {
    // setIsloading(true);
    dispatchHttp({type:'SEND'});
    fetch('https://react-hooks-update-75dee-default-rtdb.firebaseio.com/ingredients.json',{
      method:'POST',
      body:JSON.stringify(ingredient),
      headers:{'Content-Type':'application/json'}
    }).then(response=>{
      dispatchHttp({type:'RESPONSE'});
      return response.json();
    }).then(responseData=>{

      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients,
      //   { id: responseData.name, ...ingredient },
      // ]);
      dispatch({type:'ADD',ingredient: { id: responseData.name, ...ingredient }})
    }).catch(error=>{
      dispatchHttp({type:'ERROR',errorMessage:'Something went wrong!'});
          });
    
  };
  const clearError=()=>{
    // setError(null);
    // setIsloading(false);
    dispatchHttp({type:'CLEAR'})
  }
  return (
    <div className="App">
      {httpState.error && <ErrModal onClose={clearError}>{httpState.error}</ErrModal>}
      <IngredientForm  onAddIngredient={addIngredientHandler} loading={httpState.loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientshandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
