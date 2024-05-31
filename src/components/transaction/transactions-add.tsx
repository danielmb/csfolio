import { FormattedMessage } from "react-intl";
import { createTransaction } from "./(actions)/create-transaction";

export const TransactionAddForm = () => {
  return (
    <div className="space-y-4">
      <h1>Add Transaction</h1>
      <form action={createTransaction}>
        <div className="flex flex-col space-y-4">
          <label htmlFor="name">
            <FormattedMessage id="name" defaultMessage="Name" />{" "}
          </label>
          <input type="text" name="name" id="name" />
        </div>

        <div className="flex flex-col space-y-4">
          {/* <label htmlFor="description">Description</label> */}
          <label htmlFor="description">
            <FormattedMessage id="description" defaultMessage="Description" />
          </label>
          <input type="text" name="description" id="description" />
        </div>
        <div className="flex flex-col space-y-4">
          {/* <label htmlFor="price">Price</label> */}
          <label htmlFor="price">
            <FormattedMessage id="price" defaultMessage="Price" />
          </label>
          <input type="number" name="price" id="price" />
        </div>

        <div className="flex flex-col space-y-4">
          {/* <label htmlFor="type">Type</label> */}
          <label htmlFor="type">
            <FormattedMessage id="type" defaultMessage="Type" />
          </label>
          <select name="type" id="type">
            <option value="BUY">
              <FormattedMessage id="buy" defaultMessage="Buy" />
            </option>
            <option value="SELL">
              <FormattedMessage id="sell" defaultMessage="Sell" />
            </option>
          </select>
        </div>

        <button type="submit">
          <FormattedMessage
            id="addTransaction"
            defaultMessage="Add Transaction"
          />
        </button>
      </form>
    </div>
  );
};
