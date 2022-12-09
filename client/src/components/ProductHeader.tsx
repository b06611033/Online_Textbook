import React, { useContext, useState } from "react";
import {
  Container,
  Header,
  Button,
  Dropdown,
  DropdownItemProps,
  Image,
} from "semantic-ui-react";
import { ApplicationContext } from "../context";
import { Product } from "../entities";

type ProductHeaderProps = {
  image: string;
  hasSample: boolean;
  name: string;
  tag: string;
};

const ProductHeader: React.FC<ProductHeaderProps> = (props): JSX.Element => {
  const ctx = useContext(ApplicationContext);
  const [selection, setSelection] = useState<number>(-1);
  const [inCart, setInCart] = useState<boolean>();

  //subscription options for the dropdown
  const lengthOptions = [
    {
      key: "5 month  20USD",
      text: "5 month (20USD)",
      value: "5 month  20USD",
    },
    {
      key: "24 month  50USD",
      text: "24 month (50USD)",
      value: "24 month  50USD",
    },
  ];

  return (
    <Container style={{ marginTop: 10 }}>
      <Image centered size="medium" src={props.image} />
      <Header as="h2">{props.name}</Header>
      <Header as="h4">{props.tag}</Header>
      <Button
        color="blue"
        style={{ marginBottom: 10 }}
      >{`Sample Chapter`}</Button>
      <Container>
        <Dropdown
          clearable
          disabled={inCart}
          onChange={(event, data) => setSelection(data.value as number)}
          options={lengthOptions}
          placeholder={`Select subscription length`}
          selection
          style={{ marginRight: 10 }}
        />
        {inCart ? (
          <Button
            color="red"
            onClick={(event, data) => {
              ctx.setCart!([]);
              setInCart(false);
            }}
          >{`Remove from Cart`}</Button>
        ) : (
          <Button
            color="green"
            disabled={selection === -1}
            onClick={(event, data) => {
              ctx.setCart!([]);
              setInCart(true);
            }}
          >{`Add to Cart`}</Button>
        )}
      </Container>
    </Container>
  );
};

export default ProductHeader;
