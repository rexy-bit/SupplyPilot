import './App.css'
import Header from './Components/Header'
import Hero from './Components/Hero'
import HowItWorks from './Components/HowItWorks'
import Demo from './Components/Demo'
import { AgentProvider } from './Contexts/AgentContext'
import Examples from './Components/Examples'
import TryItYourself from './Components/TryItYourself'
import Features from './Components/Features'
import UseCases from './Components/UseCases'
import Limitations from './Components/Limitations'
import RoadMap from './Components/RoadMap'
import Me from './Components/Me'
import BuiltWith from './Components/BuiltWith'
import Footer from './Components/Footer'

function App() {
  

  return (
    <AgentProvider>
    <>
      
      <Header />
      <Hero/>
      <HowItWorks/>
      
        <Examples/>
        <TryItYourself/>
        <Demo/>
        <Features/>
        <UseCases/>
        <Limitations/>
        <RoadMap/>
        <Me/>
        <BuiltWith/>
        <Footer/>
    </>
    </AgentProvider>
  )
}

export default App
