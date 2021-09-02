import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

const data = [
  {category: "Sporting Goods", price: "$49.99", stocked: false, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: true, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: false, name: "Nexus 7"}
];

function SearchBar(props) {
  return (
    <div className='search-bar'>
      <div id='top'>
        <input className='input-bar' type='text' placeholder="Search..." onChange={props.onChange}/>
      </div>
      <div id='bottom'>
        <input className='box' type='checkbox' checked={props.inStockOnly} onChange={props.onChange}/>
        <p className='box-description'> Only show products in stock </p>
      </div>
    </div>
  );
}

function ProductCategoryRow(props) {
  return (
    <div id='category-header'>
      <h4 class='product-header'>{props.category}</h4> 
    </div>
  );
}

function ProductRow(props) {
  return (
    <div id='product-row'>
      <p id='product' className='product-name'> {props.name} </p>
      <p id='product' className='product-price'> {props.price} </p>
    </div>
  );
}

function ProductTable(props) {
  const column_titles = props.titles.map((title, titleIdx) =>
    <h4 id={"h4" + titleIdx} className='column-header'>{title}</h4>
  );
  
  let categories = new Set();
  let product_data = props.product_data;
  console.log(product_data);
  if (props.inStockOnly === true) {
    product_data = product_data.filter(product => product['stocked'] === true);
    console.log("checking that product_data gets filtered: ", product_data)
  }
  let final_data;
  if (props.filterText.length > 0) {
    console.log(props.filterText.length);
    console.log(props.filterText);
    final_data = product_data.filter(product => product.name.toLowerCase().startsWith(props.filterText.toLowerCase()));
  }
  else {
    final_data = product_data;
  } 
  
  final_data.forEach(product => {categories.add(product.category)});
  let cat_array = Array.from(categories);
  var table_groups = [];

  for (let i=0; i < cat_array.length; i++) {
    let group = [];
    group.push(<ProductCategoryRow category={cat_array[i]} />);
    const filtered_data = final_data.filter(product => product.category === cat_array[i]);
    const product_rows = filtered_data.map((product, productIdx) =>
      <ProductRow id={'product' + productIdx} name={product.name} price={product.price} />
    );
    const whole_group = group.concat(product_rows);
    table_groups.push(whole_group);
    
  }

  return (
    <div className='table'>
      <div className='titles'>
        {column_titles}
      </div>
      {table_groups}
    
    </div>
  );
}

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.product_data = this.props.product_data;
    this.state = {filterText: "", inStockOnly: false};
  }
  handleChange(e) {
    console.log("handleChange");
    this.handleCheckbox(e);
    this.handleSearch(e);
  }

  handleCheckbox(e) {
    console.log("handleCheckbox");
    this.setState({inStockOnly: e.target.checked});
  }

  handleSearch(e) {
    console.log((this.state.filterText));
    if (e.target.value === 'on') { 
      this.setState({filterText: ''})
    } else { 
      this.setState({filterText: e.target.value});
    }
  }

  render() {
    return (
      <div className='FPT'>        
        <SearchBar 
          inStockOnly={this.state.inStockOnly}
          onChange={this.handleChange}
          />
        <ProductTable 
          titles={["Name", "Price"]} 
          product_data={this.product_data} 
          inStockOnly={this.state.inStockOnly}
          filterText={this.state.filterText} 
          onChange={this.handleChange}/>
      </div>
    );
  }
  
}

ReactDOM.render(
  <FilterableProductTable product_data={data}/>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
