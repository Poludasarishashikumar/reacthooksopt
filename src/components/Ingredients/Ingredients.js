import React, { useCallback, useEffect, useState } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
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
    setUserIngredients(filteredIngredients);
  },[]);
 

  

  const addIngredientHandler = (ingredient) => {
    fetch('https://react-hooks-update-75dee-default-rtdb.firebaseio.com/ingredients.json',{
      method:'POST',
      body:JSON.stringify(ingredient),
      headers:{'Content-Type':'application/json'}
    }).then(response=>{
      return response.json();
    }).then(responseData=>{

      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ingredient },
      ]);
    });
    
  };
  return (
    <div className="App">
      <IngredientForm  onAddIngredient={addIngredientHandler}  />

      <section>
        <Search onLoadIngredients={filteredIngredientshandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={()=>{}} />
      </section>
    </div>
  );
}

export default Ingredients;
