import React, { useEffect } from "react";
import "./Home.css";

import Slider from "./slider";

import Img8 from "../Images/2.png";
import Img9 from "../Images/3.png";
import Img10 from "../Images/4.png";
import Img2 from "../Images/i1.png";
import Img3 from "../Images/i2.png";
import Img4 from "../Images/i3.png";
import Img5 from "../Images/i4.png";
import Img6 from "../Images/i5.png";
import Img7 from "../Images/i6.png";
import Img11 from "../Images/frame.png";
import Img12 from "../Images/pero2.png";
import Featured from "./featured";
import Latest from "./lasest";

export default function Home() {
  return (
    <div>
      <div class="cont">
        <Slider />
        <ul class="nav" />
        <div data-target="right" class="side-nav side-nav--right"></div>
        <div data-target="left" class="side-nav side-nav--left"></div>
      </div>
      <div className="container-fluid">
        <div className="row sec1">
          <div className="col-md-1"></div>
          <div className="col-md-5 text-left">
            <Featured />
          </div>
          <div className="col-md-5">
            <div className="row">
              <div className="col-2"></div>
              <div className="col-md-5 text-center">
                <img className="icons" src={Img2} />
                <p className="txt pt-5">
                  <b>Authentic</b>
                </p>
                <p className="pt-4 ">
                  Sincerity, genuineness of expression, and moral passion of the
                  artist
                </p>
              </div>
              <div className="col-md-5  text-center">
                <img className="icons" src={Img3} />
                <p className="txt pt-5">
                  <b>Online Art Gallery</b>
                </p>
                <p className="pt-4 ">Beyond visual experience</p>
              </div>
            </div>
            <div className="row pt-5">
              <div className="col-2"></div>
              <div className="col-md-5 text-center">
                <img className="icons" src={Img4} />
                <p className="txt pt-5">
                  <b>Buy Original Art Online</b>
                </p>
                <p className="pt-4 ">
                  A work of art is above all an adventure of the mind
                </p>
              </div>
              <div className="col-md-5  text-center ">
                <img className="icons" src={Img5} />
                <p className="txt pt-5">
                  <b>Fine Art Exclusive</b>
                </p>
                <p className="pt-4 ">Discover & experience Virtosu Fine Art</p>
              </div>
            </div>
            <div className="row pt-5">
              <div className="col-2"></div>
              <div className="col-md-5 text-center">
                <img className="icons" src={Img6} />
                <p className="txt pt-5">
                  <b>Art Blog</b>
                </p>
                <p className="pt-4 ">
                  Art blog covering - abstract art, critics, criticism, artworks
                  reviews, art collectors, contemporary artists.
                </p>
              </div>
              <div className="col-md-5 text-center">
                <img className="icons" src={Img7} />
                <p className="txt pt-5">
                  <b>Exhibition</b>
                </p>
                <p className="pt-4 ">
                  A wide-ranging exhibition portal of nearly 700 paintings and
                  sculptures.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
      <div className="container-fluid bg">
        <div className="row sec2">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <div className="row">
              <div className="col-md-2">
                <hr className="line" />
              </div>
              <div className="col-md-10 text-left">
                <p className="text">Buy Original </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 text-left    ">
                <h2 className="paint text-white">Paintings Available</h2>
              </div>
              <div className="col-md-6"></div>
            </div>
          </div>
          <div className="col-1"></div>
        </div>
        <Latest />
      </div>
      <div className="container-fluid bg5">
        <div className="row align-items-center">
          <div className="col-md-1"></div>
          <div className="col-md-5 text-left">
            <div className="row">
              <div className="col-md-3">
                <hr className="line" />
              </div>
              <div className="col-md-9   text-left">
                <p className="text">Extraordinary & Select Art Website </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-9 text-left">
                <h2 className="headingg">
                  Buy Original Abstract Art
                  <br />
                  Online
                </h2>
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="row">
              <div className="col-md-9">
                <p className="tex pt-3">
                  For the serious art collector, browsing a web gallery of art
                  for high quality oil paintings takes time and patience since
                  you're most likely looking for exceptional quality pieces that
                  you can add to your art collection.
                  <br />
                  <br />
                  We feature select grandmasters and contemporary visionary
                  artists whose work is both authentic and genuine, embodies the
                  spirit of modern art. We create unique and unexpected
                  experiences to invoke conversation and debate about the World
                  we all live in.
                </p>
                <img className="pro" src={Img12} />
              </div>

              <div className="col-md-3"></div>
            </div>
          </div>
          <div className="col-md-6 frame pr-0">
            <img className="w-100" src={Img11} />
          </div>
        </div>
      </div>

      <div className="bg-7">
        <div className="container">
          <div className="row py-5 align-items-center">
            <div className="col-md-5 text-center comma">
              <h2 className="headingg">Buy Original Art Online</h2>
              <p className="texi pt-3">
                Virtosu Fine Art offers an unparalleled selection of art prints,
                canvas prints and limited edition prints.
                <br />
                <br />
                Artists are finding new ways to sell their work and further
                establish themselves in their fields. Virtosu Art Gallery
                partnered with Moneta, a blockchain developer and cryptocurrency
                expert that rolled out USDM,EURM, GBPM, JPYM, CNYM, CHFM. We
                believe that blockchain could be the future of art.
              </p>
              <div className="shop pt-0">
                <button className="btn1">SHOP NOW</button>
              </div>
              <p className="text1 pt-5 text-left">
                <b>'Be drawn into a weird and wonderful fantasy universe.' </b>
              </p>
              <div className="text-left">
                <i class="icoo px-1 fa-solid fa-star"></i>
                <i class="icoo px-1  fa-solid fa-star"></i>
                <i class="icoo px-1 fa-solid fa-star"></i>
                <i class="icoo px-1 fa-solid fa-star"></i>
                <i class="icoo px-1 fa-solid fa-star"></i>
              </div>
              <p className="text1 pt-2 text-left">
                <b>Evening Standard </b>
              </p>
            </div>
            <div className="col-md-1"></div>
            <div className="col-md-6 mt-0 fdf">
              <iframe
                className="video"
                src="https://www.youtube.com/embed/vzW1XQ_TAPc"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="container">
          <div className="row pt-5">
            <div className="col-md-12 text-center">
              <i class="iii px-3 fa-brands fa-facebook"></i>
              <i class="iii px-3 fa-brands fa-twitter"></i>
              <i class="iii px-3 fa-brands fa-instagram"></i>
              <i class="iii px-3 fa-brands fa-linkedin"></i>
              <div class="subscribe pt-5">
                <div class="form">
                  <input type="email " class="form__email" />
                  <button class="form__button ml-3 ">Subcribe</button>
                </div>
              </div>
              <p className="copy pt-3">
                © 2020 Virtosu Art Gallery. All rights reserved.
                <br />
                COPYRIGHT@VIRTOSUART.COM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
