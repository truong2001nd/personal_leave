import moment from "moment";

const dateFormatter = (date) => {
  const formattedDate = moment(date).format("HH:mm DD/MM/YYYY");
  return formattedDate;
};
const date = (date) => {
  const formattedDate = moment(date).format("MM/DD/YYYY");
  return formattedDate;
};

export { dateFormatter, date };
