Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _class,_temp,_jsxFileName='src/screens/VocabScreen.js';var _react=require('react');var _react2=_interopRequireDefault(_react);var _reactNative=require('react-native');var _reactNavigation=require('react-navigation');var _GameStore=require('src/undux/GameStore');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var VocabScreen=(_temp=_class=function(_React$Component){_inherits(VocabScreen,_React$Component);function VocabScreen(props){_classCallCheck(this,VocabScreen);var _this=_possibleConstructorReturn(this,(VocabScreen.__proto__||Object.getPrototypeOf(VocabScreen)).call(this,props));_this.state={};return _this;}_createClass(VocabScreen,[{key:'render',value:function render(){var _props=this.props,navigation=_props.navigation,store=_props.store;console.log('MANGO: '+store.get('learnedVocab').size);return _react2.default.createElement(_reactNative.View,{style:styles.container,__source:{fileName:_jsxFileName,lineNumber:60}},_react2.default.createElement(_reactNative.View,{style:styles.header,__source:{fileName:_jsxFileName,lineNumber:61}},_react2.default.createElement(_reactNative.TouchableOpacity,{style:styles.backButton,onPress:function onPress(){return navigation.dispatch(_reactNavigation.NavigationActions.back());},__source:{fileName:_jsxFileName,lineNumber:62}},_react2.default.createElement(_reactNative.Image,{source:require('assets/images/text/home.png'),__source:{fileName:_jsxFileName,lineNumber:66}}))),_react2.default.createElement(_reactNative.Text,{style:styles.item,__source:{fileName:_jsxFileName,lineNumber:69}},"You've learned "+store.get('learnedVocab').size+' words!'),_react2.default.createElement(_reactNative.FlatList,{data:store.get('learnedVocab'),renderItem:function renderItem(_ref){var item=_ref.item;return _react2.default.createElement(_reactNative.Text,{style:styles.item,__source:{fileName:_jsxFileName,lineNumber:76}},'"',formatJapanese(store.get('vocabById').map(item).kana)+' = '+store.get('vocabById').map(item).english,'"');},keyExtractor:function keyExtractor(item,index){return item;},__source:{fileName:_jsxFileName,lineNumber:72}}));}}]);return VocabScreen;}(_react2.default.Component),_class.navigationOptions={title:'Vocab',header:{visible:false},gesturesEnabled:false},_temp);exports.default=(0,_GameStore.withStore)(VocabScreen);var styles=_reactNative.StyleSheet.create({container:{flex:1,alignItems:'center'},item:{fontFamily:'krungthep',marginTop:'20%',fontSize:22},backButton:{width:70,height:30},header:{position:'absolute',top:35,left:20}});