import { useRef, useState, useEffect } from "react";
import { sortPlacesByDistance } from "./loc.js";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";

function App() {

  const storedIds = JSON.parse(localStorage.getItem('selectedPlaces'))|| [];
const storedPlaces = storedIds.map((id) => AVAILABLE_PLACES.find((item)=>item.id===id))

const [isOpen,setIsOpen] = useState(false)
  
   const modal = useRef();
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [availablePlaces,setAvailablePlaces] = useState([])







  //Displays the locations based on User's current location 
useEffect(() => {
navigator.geolocation.getCurrentPosition((position) => {
    const sortedPlaces = sortPlacesByDistance(
      AVAILABLE_PLACES,
      position.coords.latitude,
      position.coords.longitude
    );

    setAvailablePlaces(sortedPlaces)
  });
}, [])


 


  function handleStartRemovePlace(id) {
  modal.current.open();
    // setIsOpen(true)
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
     modal.current.close();
    // setIsOpen(false)
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    if(storedIds.indexOf(id)=== -1) {
      localStorage.setItem('selectedPlaces', JSON.stringify([id, ...storedIds]))
    }
   
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
     modal.current.close();
    // setIsOpen(false)
const storedIds = JSON.parse(localStorage.getItem('selectedPlaces') || []);
localStorage.setItem('selectedPlaces', JSON.stringify(storedIds.filter((id)=> id !== selectedPlace.current) ))


  }

  return (
    <>
      <Modal open={isOpen}
      onClose={handleStopRemovePlace}
      >

        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting Places by User's Location"
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
