/* eslint-disable react/no-multi-comp */

import React from "react";
import useSWR from "swr";
import { Loader, Divider } from "semantic-ui-react";
import { Product } from "../entities";
import ProductHeader from "./ProductHeader";

type TextbookProps = {
  child: React.ReactNode;
  codeName: string;
  image: string;
  tag: string;
};

const Textbook: React.FC<TextbookProps> = (props): JSX.Element => {
  return (
    <>
      <ProductHeader
        hasSample
        image={props.image}
        name={props.codeName} // name of the product
        tag={props.tag} // tag line that will be showed on the product page
      />
      <Divider></Divider>
      {props.child}
      <p>
        <img
          alt="The National Science Foundation"
          src="https://www.mymathapps.com/images/nsf.png"
          style={{ verticalAlign: "middle", height: "3em" }}
        />
        &emsp;Supported in part by NSF DUE CCLI / TUES Grants 0737209 / 1123170
        (Meade) and 0737209 / 1123255 (Yasskin)
      </p>
    </>
  );
};

export default Textbook;
