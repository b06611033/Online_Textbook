import React from "react";
import { Container, Image, Header, Button, Grid, Card } from "semantic-ui-react";
import "../../App.css";
import katex from "../../resources/images/katex.png";
import maple from "../../resources/images/maple.png";
import ictcm from "../../resources/images/ictcm.png";
import logo from "../../resources/images/logo.png";
import finance from "../../resources/images/Finance/FinanceLogo.png";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import SwiperCore, { Autoplay } from 'swiper';
import { maxHeaderSize } from "http";
import { Link } from "react-router-dom";

SwiperCore.use([Autoplay]);

const slideshowImagesBasePath = "../../resources/images/";

type SlideshowProps = {
	images: Array<string>,
	style?: Object,
	shuffle: Boolean
};
const Slideshow: React.FC<SlideshowProps> = (props): JSX.Element => {
	function shuffle(a: Array<string>) {
	    for (let i = a.length - 1; i > 0; i--) {
	        const j = Math.floor(Math.random() * (i + 1));
	        [a[i], a[j]] = [a[j], a[i]];
	    }
	    return a;
	}

	var images: Array<string> = props.shuffle ? shuffle(props.images) : props.images;

	var items = images.map(image => {
		return (
			<SwiperSlide style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
				<img
					className="d-block"
					src={image}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "contain"
					}}
				/>
			</SwiperSlide>
		);
	})

	return (
		<Swiper
			updateOnWindowResize={true}
			loop={true}
			autoplay={{
        delay: 3000,
        disableOnInteraction: false
			}}
			style={{
				backgroundColor: "white",
				width: "290px",
				height: "290px"
			}}
			centeredSlides={true}
    >
			{items}
		</Swiper>
	);
};

const Logo: React.FC = (): JSX.Element => {
	return (
		<Image
			alt="MYMathApps Logo"
			width="350px"
			src={logo}
			wrapped
			ui={false}
		/>
	);
};

const Home: React.FC = (): JSX.Element => {
	let calc1Files: string[] = ["TanCotAnim.gif", "ex_cone.gif", "EgDotWorkWagon.gif", "areafndef.gif",
		"fishtank0_animate.gif", "LRS_animate.gif", "betw1rect_animate.gif", "ftcareapf3.gif",
		"LinApprox1.gif", "def_lim_both.gif", "x_RR_Cars.gif", "MRS_animate.gif", "def_lim_left.gif",
		"x_RR_ladder.gif", "PfTriIneq4.gif", "def_lim_right.gif", "yint1rect_animate.gif", "RRS_animate.gif",
		"def_tan_slope.gif", "SinCosAnim.gif", "ex_AreaIVP_sinx.gif"];

	let calc2Files: string[] = ["rect2yanimate.gif", "LRS_animate.gif", "rect3xanimate.gif",
		"MRS_animate.gif", "rect4xanimate.gif", "RRS_animate.gif", "rect4yanimate.gif",
		"area1xanimate.gif", "slopesolcrvs.gif", "area1yanimate.gif", "valentine.gif",
		"area2xanimate.gif", "xcirc_eqtrisec_animate.gif", "area2yanimate.gif",
		"xcirc_sqsec_animate.gif", "areafndef.gif", "xcircle_cylin_misc_animate.gif",
		"betw1rect_animate.gif", "xcircle_cylin_misc_solid_animate.gif", "cardioid_anim_ex.gif",
		"xcos_disks_animate.gif", "circ_eqtrisec_animate.gif", "xcos_disks_solid_animate.gif",
		"ex_AreaIVP_sinx.gif", "xexpo_cylin_misc_solid_animate.gif", "fishtank0_animate.gif",
		"xparab_cylin2_solid_animate.gif", "ftcareapf3.gif", "xparab_cylin3_solid_animate.gif",
		"limacon_anim.gif", "xparab_cylin4b_animate.gif", "parabxanimate.gif",
		"xparab_cylin4c_solid_animate.gif", "pcrvarc-animate.gif",
		"xparab_cylin_misc_2_solid_animate.gif", "r=cos2theta_anim.gif",
		"xparab_cylin_misc_solid_animate.gif", "r=cos3theta_anim.gif",
		"xparab_disk_misc_solid_animate.gif", "r=cos4theta_anim.gif",
		"xparab_horz_disc_solid_animate.gif", "r=cos5theta_anim.gif",
		"xparab_horz_washer_solid_animate.gif", "r=theta-all_anim.gif", "yint1rect_animate.gif",
		"rect2xanimate.gif"];

	let calc3Files: string[] = ["2DReimannAnimation.gif", "eg_multi_plane_cone.gif",
		"DefCrossGeomDir.gif", "ellipex.gif", "DerivAlongCrv.gif", "ex_cone.gif",
		"EgDotWorkWagon.gif", "parabeg.gif", "GradProof12.gif", "quadcubextrace.gif",
		"GradProof2D3c.gif", "quadcubeytrace.gif", "HelixOsculatingCircle.gif",
		"sincosTaylor.gif", "LinApprox2.gif", "xDotWorkVertTrack.gif", "PfTriIneq4.gif",
		"x_3dParabe.gif", "StokesMovie1-hole.gif", "x_box_div.gif",
		"def_cylcoordgrid_anim.gif", "x_box_uneven.gif", "def_lim_2D.gif", "x_fence.gif",
		"def_sphcoordgrid_anim.gif"];

	let mapletsFiles: string[] = ["AbsValLinEq.png", "ODEDirField.png",
		"ApproxIntLeftError.png", "ODEMixing.png", "Basic14Polar.png", "ParFracFindCoeff.png",
		"CMBar.png", "ParFracGenDecomp.png", "Centroid2D.png", "ParamTanLine.png",
		"DerivInvFn.png", "RRLadder.png", "EpsilonDelta.png", "RelatedRates.png",
		"FactorQuad.png", "Sec2TanGraphicNumeric.png", "GeometricSeries.png",
		"ShapeQuadCoeff.png", "Graph_df.png", "Shift.png", "ImplicitDifferentiation.png",
		"SinCosProps.png", "ImproperInt.png", "SurfAreaOfRev.png", "IntBySub.png",
		"TeleSeries.png", "LHospital.png", "TrigFnCircDef.png", "LinearApprox.png",
		"TrigSub.png", "MMAreaBox.png", "VertAsymptFind.png", "MMCrossRiver.png",
		"VolBySlicing.png", "MMFencedArea.png", "VolOfRev.png", "MMRectinEll.png",
		"WorkGravity.png", "MMTinCan.png", "WorkOnCurve.png", "MaclSerInteg.png",
		"WorkPumping.png", "MaclSerLimits.png", "WorkRope.png", "MaxMinQuad.png",
		"WorkSpring.png", "ODE1stLinear.png"];

	let calc1Imgs: string[] = [];
	let calc2Imgs: string[] = [];
	let calc3Imgs: string[] = [];
	let mapletsImgs: string[] = [];

	calc1Files.forEach(file => {
		calc1Imgs.push(require("../../resources/images/MYMACalc1/" + file));
	});
	calc2Files.forEach(file => {
		calc2Imgs.push(require("../../resources/images/MYMACalc2/" + file));
	});
	calc3Files.forEach(file => {
		calc3Imgs.push(require("../../resources/images/MYMACalc3/" + file));
	});
	mapletsFiles.forEach(file => {
		mapletsImgs.push(require("../../resources/images/M4C/" + file));
	});

	return (
		<Container fluid className="container-fluid" style={{ padding: "0" }}>
			<Container fluid className="container-fluid" style={{ padding: "0" }}>
				<Container
					style={{
						height: "180px",
						position: "relative",
						display: "flex",
						"justify-content": "center",
						"align-items": "center"
					}}
				>
					<Grid className="middle aligned">
						<Grid.Row columns={2}>
							<Grid.Column className="middle aligned six wide">
								<Logo />
							</Grid.Column>
							<Grid.Column className="ten wide">
								<p style={{ fontSize: "1.5em" }}>
									We provide instructional and supplemental learning materials
									for various math topics	created by distinguished faculty
									from universities around the United States.
								</p>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
				<Container className="ui divider"></Container>
				<Container>
					<p style={{ marginTop: 40, fontSize: "2.5em" }}>
						Online Content
					</p>
					<Grid>
						<Grid.Row columns={2} style={{height: "320px"}}>
							<Grid.Column className="five wide">
								<Card className="h-100 centered">
									<div className="image bg-white">
										<Slideshow shuffle images={calc1Imgs} />
									</div>
								</Card>
							</Grid.Column>
							<Grid.Column className="eleven wide">
								<p style={{ fontSize: "2em" }}>
									MYMathApps Calculus 1
								</p>
								<p style={{ fontSize: "1.2em" }}>
								  MYMACalc 1 is a complete course on Differential Calculus,
									plus a review of Precalculus and a start on Integral Calculus.
									The course
									is highly interactive and visual. Essentially all exercises
									have answers and full solutions and some for hints, checks
									and remarks. Each of these is hidden until the student
									clicks a button. There are lots of graphics including 2D and
									3D plots, both static and animated, and some are interactive
									based on student input.
									<br />
                                                                        <Link to="/pages/MYMACalc1">More Information</Link>

								</p>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row columns={2} style={{height: "320px"}}>
							<Grid.Column className="eleven wide">
								<p style={{ fontSize: "2em" }}>
									MYMathApps Calculus 2
								</p>
								<p style={{ fontSize: "1.2em" }}>
								  MYMACalc 2 is a complete course on Integral Calculus and
									Sequences and Series, plus an introduction to Differential
									Equations. The course
									is highly interactive and visual. Essentially all exercises
									have answers and full solutions and some for hints, checks
									and remarks. Each of these is hidden until the student
									clicks a button. There are lots of graphics including 2D and
									3D plots, both static and animated, and some are interactive
									based on student input.
									<br />
                                                                        <Link to="/pages/MYMACalc2">More Information</Link>
								</p>
							</Grid.Column>
							<Grid.Column className="five wide">
								<Card className="h-100 centered">
									<div className="image bg-white">
										<Slideshow shuffle images={calc2Imgs} />
									</div>
								</Card>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row columns={2} style={{height: "320px"}}>
							<Grid.Column className="five wide">
								<Card className="h-100 centered">
									<div className="image bg-white">
										<Slideshow shuffle images={calc3Imgs} />
									</div>
								</Card>
							</Grid.Column>
							<Grid.Column className="eleven wide">
								<p style={{ fontSize: "2em" }}>
									MYMathApps Calculus 3
								</p>
								<p style={{ fontSize: "1.2em" }}>
								  MYMACalc 3 is a complete course on Multivariable Calculus
									including Green's, Stokes' and Gauss' Theorems. The course
									is highly interactive and visual. Essentially all exercises
									have answers and full solutions and some for hints, checks
									and remarks. Each of these is hidden until the student
									clicks a button. There are lots of graphics including 2D and
									3D plots, both static and animated, and some are interactive
									based on student input.
									<br />
                                                                        <Link to="/pages/MYMACalc3">More Information</Link>
								</p>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row columns={2} style={{height: "320px"}}>
							<Grid.Column className="eleven wide">
								<p style={{ fontSize: "2em" }}>
									Maplets for Calculus
								</p>
								<p style={{ fontSize: "1.2em" }}>
								  M4C is a collection Maple-based applets which help students
									learn all three semesters of calculus. They present students
									with questions and guide them through the solution process.
									They only work on computers on which the Maple computer
									algebra system is installed. They are included with all of
									MYMathApps Calculus texts but are also available separately.
									<br />
                                                                        <Link to="/pages/m4c">More Information</Link>
								</p>
							</Grid.Column>
							<Grid.Column className="five wide">
								<Card className="h-100 centered">
									<div style={{
										position: "relative"
									}} className="image bg-white">
										<Slideshow style={{
											position: "relative"
										}} shuffle images={mapletsImgs} />
										<Image
											alt="ICTCM"
											as="a"
											href="https://en.wikipedia.org/wiki/ICTCM_Award"
											style={{
												position: "absolute",
												left: "0",
												top: "0",
												zIndex: "999"
											}}
											width="100px"
											src={ictcm}
											wrapped
											ui={false}
											target="_blank"
										/>
									</div>
								</Card>
							</Grid.Column>
						</Grid.Row>
					</Grid>

					<p style={{ marginTop: 40, fontSize: "2.5em" }}>
						Downloadable Textbooks
					</p>

					<Grid>
						<Grid.Row columns={3}>
							<Grid.Column>
								<Card className="bg-white centered">
									<Image className="bg-white" src={finance} wrapped ui={false} />
									<Card.Content>
										<p style={{ fontSize: "1.5em" }}>
											Introduction to Derivative Securities
										</p>
									</Card.Content>
								</Card>
							</Grid.Column>
							<Grid.Column>
								<Card className="bg-white centered">
									<Image className="bg-white" src={finance} wrapped ui={false} />
									<Card.Content>
										<p style={{ fontSize: "1.5em" }}>
											Fixed Income Fundamentals
										</p>
									</Card.Content>
								</Card>
							</Grid.Column>
							<Grid.Column>
								<Card className="bg-white centered">
									<Image className="bg-white" src={finance} wrapped ui={false} />
									<Card.Content>
										<p style={{ fontSize: "1.5em" }}>
											Essays in Portfolio Management
										</p>
									</Card.Content>
								</Card>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
				<Container
					style={{
						background: "#3B8BEA",
						color: "white",
						marginTop: "40px",
						paddingTop: "20px",
						paddingBottom: "60px",
						textAlign: "center"
					}}
				fluid>
					<p style={{ marginTop: "20px", fontSize: "2em" }}>
						Our products use a variety of technologies to help you quickly learn new math
						concepts.
					</p>
					<Container
						style={{
							display: "flex",
							justifyContent: "space-around",
							alignItems: "center"
						}}
					>
						<Image
							alt="KaTeX"
							as="a"
							href="https://katex.org/"
							src={katex}
							width="175"
							target="_blank"
						/>
						<Image
							alt="MathJax"
							as="a"
							href="https://www.mathjax.org"
							src="https://www.mathjax.org/badge/mj_logo.png"
							width="175"
							target="_blank"
						/>
						<Header
							as="a"
							href="http://mathlex.org/"
							style={{
								color: "#0b0",
								fontSize: "4em",
							    fontFamily: "ChunkFive",
							    lineHeight: "normal",
							    latterSpacing: "1px"
							}}
							target="_blank"
						>
							MathLex
						</Header>
						<span>
							<Image
								alt="Maple"
								as="a"
								href="https://maplesoft.com/products/Maple/"
								src={maple}
								width="130"
								target="_blank"
							/>
							<span style={{ marginLeft: 15, fontSize: "1.5em" }}>Maple</span>
						</span>
					</Container>
				</Container>
				<Container
					style={{
						background: "#343A40",
						color: "white",
						paddingTop: "40px",
						paddingBottom: "40px",
						textAlign: "center"
					}}
				fluid>
					Copyright © 2011–19 P. B. Yasskin and D. B. Meade. All rights reserved.
				</Container>
			</Container>
		</Container>
	);
};

export default Home;
