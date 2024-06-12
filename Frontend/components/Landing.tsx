import Head from "next/head";
import Script from "next/script";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';
export default function Landing() {

  const router = useRouter();

  useEffect(() => {
    // Save the original destination in localStorage
    localStorage.setItem('originalDestination', router.asPath);

    // Load scripts in order
    const loadScripts = async () => {
      await loadScript("/jquery-3.2.1.min.js");
      await loadScript("/all-plugins.js");
      await loadScript("/plugins-activate.js");
    };

    loadScripts();
  }, [router.asPath]);

  const loadScript = (src: string) => {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Script load error for ${src}`));
      document.head.appendChild(script);
    });
  };

  const handleClick = function (url: any) {

    router.push(url);
  }

  return (
    <div id="page-top">
      <Head>
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
      </Head>
      {/* <!-- Navigation --> */}
      <div className="logo">
        <Image src="/images/logo.png" alt="logo" width={200} height={200} />
      </div>
      <a className="menu-toggle rounded" href="#">
        <i className="fa fa-bars"></i>
      </a>
      <nav id="sidebar-wrapper">
        <ul className="sidebar-nav">
          <li className="sidebar-brand">
            <a className="smooth-scroll" href="#Header"></a>
          </li>
          <li className="sidebar-nav-item">
            <a className="smooth-scroll" href="#page-top">Home</a>
          </li>
          <li className="sidebar-nav-item">
            <a className="smooth-scroll" href="#About">About</a>
          </li>
          <li className="sidebar-nav-item">
            <a className="smooth-scroll" href="#Services">Services</a>
          </li>
          <li className="sidebar-nav-item">
            <a className="smooth-scroll" href="#Contact">Contact</a>
          </li>
        </ul>
      </nav >
      {/* < !--Header Starts-- > */}
      <section id="Banner" className="content-section">
        <div className="container content-wrap text-center">
          <h1>Online PDF Editor</h1>
          <h3>
            <em>Tools to start editing PDF documents</em>
          </h3>
          <a className="btn btn-primary btn-xl smooth-scroll" href="#About">Find Out More</a>
        </div>
        <div className="overlay"></div>
      </section>
      {/* <!--Header Ends-- > */}
      {/* < !--About Us Starts-- > */}
      <section id="About" className="content-section">
        <div className="container text-center">
          <div className="row">
            <div className="col-lg-12">
              <div className="block-heading">
                <h2>About Us</h2>
              </div>
              <p className="lead">This editor supports useful features</p>
            </div>
          </div>
        </div>
      </section>
      {/* <!--About Us Starts-- > */}
      <section id="Services" className="content-section text-center">
        <div className="container">
          <div className="block-heading">
            <h2>What We Offer</h2>
            <p>You can choose one.</p>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-6">
              <div className="service-box" onClick={() => { handleClick('/documents') }}>
                <div className="service-icon yellow">
                  <div className="front-content">
                    <i className="fa fa-book" aria-hidden="true"></i>
                    <h3>PDF Viewer</h3>
                  </div>
                </div>
                <div className="service-content">
                  <h3>PDF Viewer</h3>
                  <p>You can read your PDF document and use some extra features.</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="service-box" onClick={() => { handleClick('/reorder_pages') }}>
                <div className="service-icon orange">
                  <div className="front-content">
                    <i className="fa fa-file-o"></i>
                    <h3>Manage your Page</h3>
                  </div>
                </div>
                <div className="service-content">
                  <h3>Manage your Page</h3>
                  <p>You can simply change the order of pages and delete pages by your hand.</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="service-box " onClick={() => { handleClick('/extract_text') }}>
                <div className="service-icon red">
                  <div className="front-content">
                    <i className="fa fa-font" aria-hidden="true"></i>
                    <h3>Extract Text</h3>
                  </div>
                </div>
                <div className="service-content">
                  <h3>Extract Text</h3>
                  <p>You can extract text from your PDF document.</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="service-box" onClick={() => { handleClick('/image2text') }}>
                <div className="service-icon grey">
                  <div className="front-content">
                    <i className="fa fa-openid"></i>
                    <h3>Image to Text</h3>
                  </div>
                </div>
                <div className="service-content">
                  <h3>Image to Text</h3>
                  <p>You can extract text from specified image using OCR function.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-6" onClick={() => { handleClick('/word2pdf') }}>
              <div className="service-box">
                <div className="service-icon yellow">
                  <div className="front-content">
                    <i className="fa fa-file-word-o" aria-hidden="true"></i>
                    <h3>Word to PDF</h3>
                  </div>
                </div>
                <div className="service-content">
                  <h3>Word to PDF</h3>
                  <p>You can convert your Word document to PDF document easily.</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="service-box" onClick={() => { handleClick('/excel2pdf') }}>
                <div className="service-icon orange">
                  <div className="front-content">
                    <i className="fa fa-file-excel-o"></i>
                    <h3>Excel to PDF</h3>
                  </div>
                </div>
                <div className="service-content">
                  <h3>Excel to PDF</h3>
                  <p>You can convert your excel document to PDF document simply.</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="service-box " onClick={() => { handleClick('/image2pdf') }}>
                <div className="service-icon red">
                  <div className="front-content">
                    <i className="fa fa-picture-o" aria-hidden="true"></i>
                    <h3>Image to PDF</h3>
                  </div>
                </div>
                <div className="service-content">
                  <h3>Image to PDF</h3>
                  <p>You can make PDF document from images perfectly.</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="service-box">
                <div className="service-icon grey">
                  <div className="front-content">
                    <i className="fa fa-code-fork"></i>
                    <h3>Version Control</h3>
                  </div>
                </div>
                <div className="service-content">
                  <h3>Version Control</h3>
                  <p>You can manage your pdf version easily.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="Contact" className="content-section">
        <div className="container">
          <div className="block-heading">
            <h2>Contact Us</h2>
            <p>Please contact with us</p>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6">
              <div className="contact-wrapper">
                <div className="address-block border-bottom">
                  <h3 className="add-title">Headquaters</h3>
                  <div className="c-detail">
                    <span className="c-icon"><i className="fa fa-map-marker" aria-hidden="true"></i></span><span className="c-info">&nbsp;35 Street - Cheyenne, CO 80810</span>
                  </div>
                  <div className="c-detail">
                    <span className="c-icon"><i className="fa fa-phone" aria-hidden="true"></i></span><span className="c-info">+123 4567 898</span>
                  </div>
                  <div className="c-detail">
                    <span className="c-icon"><i className="fa fa-envelope" aria-hidden="true"></i></span><span className="c-info">email@yourdomain.com</span>
                  </div>
                </div>
                <div className="address-block">
                  <h3 className="add-title">Branch</h3>
                  <div className="c-detail">
                    <span className="c-icon"><i className="fa fa-map-marker" aria-hidden="true"></i></span><span className="c-info">&nbsp;98 Berry - Cheyenne, CO 80810</span>
                  </div>
                  <div className="c-detail">
                    <span className="c-icon"><i className="fa fa-phone" aria-hidden="true"></i></span><span className="c-info">+123 4567 8987</span>
                  </div>
                  <div className="c-detail">
                    <span className="c-icon"><i className="fa fa-envelope" aria-hidden="true"></i></span><span className="c-info">email@yourdomain.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >
      </section >
      <footer className="footer text-center">
        <div className="container">
          <ul className="list-inline">
            <li className="list-inline-item">
              <a className="social-link rounded-circle text-white mr-3" href="#">
                <i className="fa fa-facebook" aria-hidden="true"></i>
              </a>
            </li>
            <li className="list-inline-item">
              <a className="social-link rounded-circle text-white mr-3" href="#">
                <i className="fa fa-twitter" aria-hidden="true"></i>
              </a>
            </li>
            <li className="list-inline-item">
              <a className="social-link rounded-circle text-white" href="#">
                <i className="fa fa-linkedin" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
          <p className="text-muted small mb-0">Copyright © PDF Editor 2024</p>
        </div>
      </footer>
    </div>
  )
}