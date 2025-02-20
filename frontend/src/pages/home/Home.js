import React from "react"

import Slider from "../../components/slider/slider"
import "./Home.scss"
import ParallaxSection from "../../components/Parallex/Parallex"
//import HomeInfoBox from "./HomeInfoBox"
import { productData } from "../../components/corousel/data"
import CarouselItem from "../../components/corousel/CarouselItem"
import ProductCarousel from "../../components/corousel/Carousel"
import ProductCategory from "./ProductCategory"
import FooterLinks from "../../components/footer/FooterLinks"
import ParallaxSection2 from "../../components/Parallex2/Parallex"

const PageHeading = ({heading, btnText})=>{
    return (
        <>
         <div className="--flex-between">
            <h2 className="--fw-thin">{heading}</h2>
            <button className="--btn">
                {btnText}
            </button>
         </div>
         <div className="--hr"></div>
        </>
    )
}

const Home=()=>{
    const productss = productData.map((item,index)=>(
        <div key={index.id}>
            <CarouselItem
            name={item.name}
            url={item.imageurl}
            price={item.price}
            description={item.description}
            />

        </div>
    ))
    return (
        <>
          <Slider/>  
          <section>
            <div className="container">
              
               
                <ProductCarousel products={productss}/>
            </div>

          </section>
         

            <div >
                <ParallaxSection/>
               
            </div>
            <div>
            <ParallaxSection2/>
            </div>

         
          <section>
            <div className="container">
              
                
                <ProductCarousel products={productss}/>
            </div>

          </section>

          <FooterLinks />

        </>
    )
}

export default Home