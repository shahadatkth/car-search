import React from 'react';
import Map from "./Map";
import Autocomplete from 'react-autocomplete';
import ApiCall from "./../services/ApiCall";

export default class App extends React.Component {

    constructor(props, context) {
        super(props, context);

        // Set initial State
        this.state = {
            value: "",
            autocompleteData: [],
            address:{},
            lat:"",
            lng:""
        };

        // Bind `this` context to functions of the class
        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.getItemValue = this.getItemValue.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.retrieveDataAsynchronously = this.retrieveDataAsynchronously.bind(this);
    }


    /**
     * Updates the state of the autocomplete data with the remote data obtained via AJAX.
     *
     * @param {String} searchText content of the input that will filter the autocomplete data.
     * @return {Nothing} The state is updated but no value is returned
     */
    /*apiCall(url){
        return axios.get(url)
            .then(function (response) {
                return (response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }*/
    retrieveDataAsynchronously(searchText){
        let _this = this;

        // Url of your website that process the data and returns a
        let url = `https://cors.io/?https://cabonline-frontend-test.herokuapp.com/addresses?q=${searchText}`;

        ApiCall(url).then(function (response) {
            console.log(response);
            const filteredSuggestions = response.data.filter(
                state =>  ( state.type.toLowerCase() === "road")
            );
            _this.setState({
                autocompleteData: filteredSuggestions
            });
        });

    }
    retrieveCabDataAsynchronously(lat,lng){
        let _this = this;
        _this.setState({
            lat: lat,
            lng:lng
        });

        // Url of your website that process the data and returns a
        let url = `https://cors.io/?https://cabonline-frontend-test.herokuapp.com/vehicles?lat=${lat}&lng=${lng}`;
        ApiCall(url).then(function (response) {
            console.log(response.data);

            _this.setState({
                address: response.data
            });
        });

    }

    /**
     * Callback triggered when the user types in the autocomplete field
     *
     * @param {Event} e JavaScript Event
     * @return {Event} Event of JavaScript can be used as usual.
     */
    onChange(e){
        this.setState({
            value: e.target.value
        });

        /**
         * Handle the remote request with the current text !
         */
        this.retrieveDataAsynchronously(e.target.value);

    }

    /**
     * Callback triggered when the autocomplete input changes.
     *
     * @param {Object} val Value returned by the getItemValue function.
     * @return {Nothing} No value is returned
     */
    onSelect(val){
        this.setState({
            value: val
        });

        const address = val.split(' - ');

        const filteredSuggestions = this.state.autocompleteData.find(
          state =>  ( state.streetName.toLowerCase() === address[0].toLowerCase() &&
            state.city.toLowerCase() === address[1].toLowerCase())
        );

        this.retrieveCabDataAsynchronously(filteredSuggestions.latitude,filteredSuggestions.longitude )

    }

    /**
     * Define the markup of every rendered item of the autocomplete.
     *
     * @param {Object} item Single object from the data that can be shown inside the autocomplete
     * @param {Boolean} isHighlighted declares wheter the item has been highlighted or not.
     * @return {Markup} Component
     */
    renderItem(item, isHighlighted){

        return (
            <div key={item.id} style={{ background: isHighlighted ? 'lightgray' : 'white' , zIndex:999}}>
                {item.streetName} - {item.city}
            </div>
        );
    }

    /**
     * Define which property of the autocomplete source will be show to the user.
     *
     * @param {Object} item Single object from the data that can be shown inside the autocomplete
     * @return {String} val
     */
    getItemValue(item){


        // You can obviously only return the Label or the component you need to show
        // In this case we are going to show the value and the label that shows in the input
        // something like "kungsgatan-stockholm"
        return `${item.streetName} - ${item.city}`;
    }

    render() {

        return (
            <div>
            <div className="search-area">
                <Autocomplete
                    inputProps={{ style: { width: '100%',height: '40px',margin:'auto',fontSize:"18px",paddingLeft:"10px"}, placeholder: 'Search street name..'}}
                    getItemValue={this.getItemValue}
                    items={this.state.autocompleteData}
                    renderItem={this.renderItem}
                    value={this.state.value}
                    onChange={this.onChange}
                    onSelect={this.onSelect}
                    wrapperStyle={{ width:  '60%'  ,margin:'auto' }}
                    menuStyle={{
                        borderRadius: '3px',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '2px 0',
                        fontSize: '90%',
                        position: 'fixed',
                        overflow: 'auto',
                        maxHeight: '50%',
                        zIndex: '998',
                    }}
                />



            </div>
                {this.state.address.length >= 1 &&
                <Map
                    center={{ lat: this.state.lat, lng: this.state.lng }}
                    zoom={14}
                    places={this.state.address}
                />
                }
            </div>
        );
    }
}