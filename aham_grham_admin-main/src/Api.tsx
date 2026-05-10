import { useEffect } from "react";
import axios from "axios";

function Api() {

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }, []);

  return <h1>Check console</h1>;
}

export default Api;
