import { useState } from "react";
import { useQuery } from "react-query";
//components

import Card from "./Card/Card";
import Item from "./Item/Item";
import Drawer from "@material-ui/core/Drawer";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import AddShoppingCardIcon from "@material-ui/icons/AddShoppingCart";
import Badge from "@material-ui/core/Badge";
//styles
import { Wrapper, StyledButton } from "./App.styles";
//Types
export type CardItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

const getProduct = async (): Promise<CardItemType[]> => {
  return await (await fetch("https://fakestoreapi.com/products")).json();
};

const App = () => {
  const [cardIsOpen, setCardIsOpen] = useState(false);
  const [cardItems, setCardItems] = useState([] as CardItemType[]);
  const { data, isLoading, error } = useQuery<CardItemType[]>(
    "products",
    getProduct
  );
  console.log(data);

  const getTotalItems = (items: CardItemType[]) => {
    return items.reduce((acc: number, item) => acc + item.amount, 0);
  };
  const handleAddToCard = (clickedItem: CardItemType) => {
    setCardItems((prev) => {
      // 1. Is the item already added in the card?
      const isItemInCard = prev.find((item) => item.id === clickedItem.id);
      if (isItemInCard) {
        return prev.map((item) =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }
      // First time the item is added
      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };
  const handleRemoveFromCard = (id: Number) => {
    setCardItems((prev) =>
      prev.reduce((acc, item) => {
        if (item.id === id) {
          if (item.amount === 1) return acc;
          return [...acc, { ...item, amount: item.amount - 1 }];
        } else {
          return [...acc, item];
        }
      }, [] as CardItemType[])
    );
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something Went Wrong..</div>;
  return (
    <Wrapper>
      <Drawer
        anchor="right"
        open={cardIsOpen}
        onClose={() => setCardIsOpen(false)}
      >
        <Card
          cardItems={cardItems}
          addToCard={handleAddToCard}
          removeFromCard={handleRemoveFromCard}
        />
      </Drawer>
      <StyledButton onClick={() => setCardIsOpen(true)}>
        <Badge badgeContent={getTotalItems(cardItems)} color="error">
          <AddShoppingCardIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCard={handleAddToCard} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default App;
