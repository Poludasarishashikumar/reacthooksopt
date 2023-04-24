import React, { useEffect, useState ,useCallback,useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onLoadIngredients}=props;
  const [enteredFilter,setEnteredFiltered]=useState('');
  const inputRef=useRef();
  useEffect(()=>{
    setTimeout(()=>{
      if(enteredFilter===inputRef.current.value){

        const query=enteredFilter.length===0?'':`?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch('https://react-hooks-update-75dee-default-rtdb.firebaseio.com/ingredients.json'+query).then(
          response=>response.json()).then(
            responseData=>{
              const loadedIngredients=[];
              for(const key in responseData)
              {
                loadedIngredients.push({
                  id:key,
                  title:responseData[key].title,
                  amount:responseData[key].amount
                })
              }
              props.onLoadIngredients(loadedIngredients);
            }
          );
      }
    },500)
  },[enteredFilter,onLoadIngredients,inputRef])
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" ref={inputRef} value={enteredFilter} onChange={event=>setEnteredFiltered(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
