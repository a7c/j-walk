Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _class,_temp,_jsxFileName='src/screens/SettingsScreen.js';var _react=require('react');var _react2=_interopRequireDefault(_react);var _reactNative=require('react-native');var _reactNavigation=require('react-navigation');var _GameStore=require('src/undux/GameStore');var _Types=require('src/jp/Types');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var SettingsScreen=(_temp=_class=function(_React$Component){_inherits(SettingsScreen,_React$Component);function SettingsScreen(props){_classCallCheck(this,SettingsScreen);return _possibleConstructorReturn(this,(SettingsScreen.__proto__||Object.getPrototypeOf(SettingsScreen)).call(this,props));}_createClass(SettingsScreen,[{key:'render',value:function render(){var _props=this.props,navigation=_props.navigation,store=_props.store;return _react2.default.createElement(_reactNative.View,{style:styles.container,__source:{fileName:_jsxFileName,lineNumber:53}},_react2.default.createElement(_reactNative.View,{style:styles.header,__source:{fileName:_jsxFileName,lineNumber:54}},_react2.default.createElement(_reactNative.TouchableOpacity,{style:styles.backButton,onPress:function onPress(){return navigation.dispatch(_reactNavigation.NavigationActions.back());},__source:{fileName:_jsxFileName,lineNumber:55}},_react2.default.createElement(_reactNative.Image,{source:require('assets/images/text/home.png'),__source:{fileName:_jsxFileName,lineNumber:59}}))),_react2.default.createElement(_reactNative.View,{style:styles.body,__source:{fileName:_jsxFileName,lineNumber:62}},_react2.default.createElement(_reactNative.Text,{style:styles.description,__source:{fileName:_jsxFileName,lineNumber:63}},' Set User ID '),_react2.default.createElement(_reactNative.View,{style:styles.userIdFlex,__source:{fileName:_jsxFileName,lineNumber:64}},_react2.default.createElement(_reactNative.TouchableOpacity,{onPress:function onPress(){return generateID(store);},style:styles.idButton,color:'#FFFFFF',__source:{fileName:_jsxFileName,lineNumber:65}},_react2.default.createElement(_reactNative.Text,{style:styles.saveText,__source:{fileName:_jsxFileName,lineNumber:72}},'Generate ID')),_react2.default.createElement(_reactNative.TextInput,{style:styles.inputBox,editable:false,value:store.get('playerID'),__source:{fileName:_jsxFileName,lineNumber:74}})),_react2.default.createElement(_reactNative.Text,{style:styles.description,__source:{fileName:_jsxFileName,lineNumber:80}},' Set Japanese Display Style '),_react2.default.createElement(_reactNative.Picker,{selectedValue:store.get('jpDisplayStyle'),style:styles.picker,onValueChange:function onValueChange(itemValue,itemIndex){return store.set('jpDisplayStyle')(itemValue);},itemStyle:{backgroundColor:'#FFA37F',fontFamily:'krungthep'},__source:{fileName:_jsxFileName,lineNumber:81}},_react2.default.createElement(_reactNative.Picker.Item,{label:'Kana',value:'KANA',style:styles.item,__source:{fileName:_jsxFileName,lineNumber:92}}),_react2.default.createElement(_reactNative.Picker.Item,{label:'Kanji',value:'KANJI',style:styles.item,__source:{fileName:_jsxFileName,lineNumber:93}}),_react2.default.createElement(_reactNative.Picker.Item,{label:'Romaji',value:'ROMAJI',style:styles.item,__source:{fileName:_jsxFileName,lineNumber:94}})),_react2.default.createElement(_reactNative.TouchableOpacity,{onPress:function onPress(){return _reactNative.Alert.alert('Your settings have been saved!','Return Home?',[{text:'Not Yet'},{text:'Yes Please!',onPress:function onPress(){return navigation.dispatch(_reactNavigation.NavigationActions.back());}}],{cancelable:false});},style:styles.saveButton,color:'#FFFFFF',__source:{fileName:_jsxFileName,lineNumber:96}},_react2.default.createElement(_reactNative.Text,{style:styles.saveText,__source:{fileName:_jsxFileName,lineNumber:117}},'Save')),_react2.default.createElement(_reactNative.TouchableOpacity,{onPress:function onPress(){return _reactNative.Alert.alert('Are you sure you want to clear your data?','This cannot be undone.',[{text:'No'},{text:'Yes',onPress:function onPress(){return clearData(store);}}],{cancelable:false});},style:styles.clearButton,color:'#FFFFFF',__source:{fileName:_jsxFileName,lineNumber:119}},_react2.default.createElement(_reactNative.Text,{style:styles.saveText,__source:{fileName:_jsxFileName,lineNumber:140}},'Clear Data'))));}}]);return SettingsScreen;}(_react2.default.Component),_class.navigationOptions={title:'Settings',header:{visible:false},gesturesEnabled:false},_temp);function clearData(store){store.set('playerID')('');store.set('jpDisplayStyle')('KANA');}function generateID(store){var alphabet=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];var min=10;var max=99;var num=String(Math.round(min+Math.random()*(max-min)));var letter=alphabet[Math.floor(Math.random()*alphabet.length)];var id=letter+num;store.set('playerID')(id);}exports.default=(0,_GameStore.withStore)(SettingsScreen);var styles=_reactNative.StyleSheet.create({container:{flex:1,alignItems:'center'},inputBox:{backgroundColor:'#FFA37F',fontFamily:'krungthep',marginTop:15,marginLeft:5,width:'30%',fontSize:22,borderColor:'white',borderWidth:2,borderRadius:5,padding:5},picker:{marginTop:10,width:'90%',borderColor:'white',borderWidth:2,borderRadius:5},description:{marginTop:40,textAlign:'center',fontFamily:'krungthep',fontSize:22},backButton:{width:70,height:30},saveButton:{marginTop:30,backgroundColor:'white',width:'90%',height:45,borderColor:'transparent',borderWidth:0,borderRadius:5},saveText:{fontFamily:'krungthep',fontSize:22,textAlign:'center',marginTop:8},clearButton:{marginTop:15,backgroundColor:'white',width:'90%',height:45,borderColor:'transparent',borderWidth:0,borderRadius:5},idButton:{marginTop:15,marginRight:5,backgroundColor:'white',width:'40%',height:45,borderColor:'transparent',borderWidth:0,borderRadius:5},header:{position:'absolute',top:35,left:20},body:{marginTop:40,flex:1,width:'100%',alignItems:'center'},userIdFlex:{flexDirection:'row',alignItems:'center'}});