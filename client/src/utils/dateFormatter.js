import moment from "moment";

const dateFormatter = ({ date }) => {
  const formattedDate = moment(date).format("HH:mm DD/MM/YYYY");
  return formattedDate;
};

export { dateFormatter };
