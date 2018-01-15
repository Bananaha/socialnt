import React, { Component } from "react";
import AutoComplete from "material-ui/AutoComplete";
import { get } from "../services/request.service";
import _, { map } from "lodash";
import "whatwg-fetch";

class SearchBar extends Component {
  // const data
  // handleUpdateInput = value => {
  //   console.log(value);
  //   get(`/users/search/${value}`)
  //     .then(users => {})
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };
  // render() {
  //   return (
  //     <div>
  //       <div>
  //         <AutoComplete
  //           hintText="Type anything"
  //           dataSource={this.state.users}
  //           dataSourceConfig={dataSourceConfig}
  //           onUpdateInput={this.handleUpdateInput}
  //         />
  //       </div>
  //     </div>
  //   );
  // }
}

export default SearchBar;
