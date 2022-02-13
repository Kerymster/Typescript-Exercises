import CardItem from "../Card-Item/Card-Item";
//styles
import { Wrapper } from "./Card-styles";
//types
import { CardItemType } from "../App";
import { type } from "os";

type Props = {
  cardItems: CardItemType[];
  addToCard: (clickedItem: CardItemType) => void;
  removeFromCard: (id: number) => void;
};

const Card: React.FC<Props> = ({ cardItems, addToCard, removeFromCard }) => {
  const calculateTotal = (items: CardItemType[]) =>
    items.reduce((acc: number, item) => acc + item.amount * item.price, 0);
  return (
    <Wrapper>
      <h2>Your Shopping Card</h2>
      {cardItems.length === 0 ? <p>No Items In Card</p> : null}
      {cardItems.map((item) => (
        <CardItem
          key={item.id}
          item={item}
          addToCard={addToCard}
          removeFromCard={removeFromCard}
        />
      ))}
      <h2>Total: ${calculateTotal(cardItems).toFixed(2)}</h2>
    </Wrapper>
  );
};

export default Card;
