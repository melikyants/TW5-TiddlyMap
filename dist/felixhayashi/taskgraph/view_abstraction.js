/*\

title: $:/plugins/felixhayashi/taskgraph/view_abstraction.js
type: application/javascript
module-type: library

@preserve

\*/
var utils=require("$:/plugins/felixhayashi/taskgraph/utils.js").utils,ViewAbstraction=function(t,i){if(t instanceof ViewAbstraction)return t;if(this.wiki=$tw.wiki,this.opt=$tw.taskgraph.opt,this.logger=$tw.taskgraph.logger,this.path=utils.getEmptyMap(),this.path.config=this._getConfigPath(t),i)this._createView();else if(!this.exists())return;this.path.map=this.path.config+"/map",this.path.nodeFilter=this.path.config+"/filter/nodes",this.path.edgeFilter=this.path.config+"/filter/edges",this._ignoreOnNextRebuild=utils.getEmptyMap(),this.rebuildCache(utils.getValues(this.path))};ViewAbstraction.prototype._getConfigPath=function(t){if(t instanceof $tw.Tiddler)return t.fields.title;if("string"==typeof t){if(utils.startsWith(t,this.opt.path.views)){var i=this.opt.path.views+"/";t=t.substr(i.length)}if(-1===t.indexOf("/"))return this.opt.path.views+"/"+t}},ViewAbstraction.prototype.getPaths=function(){return this.path},ViewAbstraction.prototype._createView=function(){this.exists()&&this.destroy();var t={};t.title=this.path.config,t[this.opt.field.viewMarker]=!0,t.id=utils.genUUID(),this.wiki.addTiddler(new $tw.Tiddler(t))},ViewAbstraction.prototype.refresh=function(t){return this.rebuildCache(Object.keys(t))},ViewAbstraction.prototype.rebuildCache=function(t,i){if(!this.exists())return[];-1!=t.indexOf(this.path.config)&&(this.logger("debug","View's config is requested to be rebuild -> trigger full rebuild"),t=utils.getValues(this.path));var e=this._ignoreOnNextRebuild;this._ignoreOnNextRebuild=utils.getEmptyMap();for(var s=[],r=0;r<t.length;r++){var o=t[r];if(i||!e[o]){switch(o){case this.path.config:this.config=this.getConfig(null,!0);break;case this.path.map:this.positions=this.getPositions(!0);break;case this.path.nodeFilter:this.nodeFilter=this.getNodeFilter(null,!0);break;case this.path.edgeFilter:this.edgeFilter=this.getEdgeFilter(null,!0);break;case this.path.edgeFilter:default:continue}s.push(o)}}return s},ViewAbstraction.prototype.exists=function(){return utils.tiddlerExists(this.path.config)},ViewAbstraction.prototype.getRoot=function(){return this.path.config},ViewAbstraction.prototype.getLabel=function(){return this.exists()?utils.getBasename(this.path.config):void 0},ViewAbstraction.prototype.destroy=function(){if(this.exists()){var t="[prefix["+this.getRoot()+"]]";utils.deleteTiddlers(utils.getMatches(t)),this.path=utils.getEmptyMap()}},ViewAbstraction.prototype.rename=function(t){if(this.exists()&&"string"==typeof t&&-1===t.indexOf("/")){var i=this.getLabel();if(i!==t){for(index in this.path){var e=this.wiki.getTiddler(this.path[index]);e&&(this.path[index]=this.path[index].replace(i,t),this.wiki.addTiddler(new $tw.Tiddler(e,{title:this.path[index]})),this.wiki.deleteTiddler(e.fields.title))}this.rebuildCache(utils.getValues(this.path),!0)}}},ViewAbstraction.prototype.isConfEnabled=function(t){return"true"===this.getConfig(t)},ViewAbstraction.prototype.getConfig=function(t,i){if(!this.exists())return utils.getEmptyMap();if(!i&&this.config)var e=this.config;else var s=this.wiki.getTiddler(this.path.config).fields,e=utils.getPropertiesByPrefix(s,"config-",!0);return t?e[t]:e},ViewAbstraction.prototype.setNodeFilter=function(t){this.exists()&&(t=t.replace("\n"," "),this.getNodeFilter.expression!==t&&(this.wiki.addTiddler(new $tw.Tiddler({title:this.path.nodeFilter,filter:t.replace("\n"," ")})),this.nodeFilter=this.getNodeFilter(null,!0),this._ignoreOnNextRebuild[this.path.nodeFilter]=!0))},ViewAbstraction.prototype.getPrettyNodeFilterExpr=function(){var t=this.getNodeFilter("expression").trim().replace("][","] ["),i=/[\+\-]?\[.+?[\]\}\>]\]/g,e=t.match(i);t=t.replace(i," [] ").trim();for(var s=t.split(/\s+/),r=0,o=[],n=0;n<s.length;n++)o[n]="[]"===s[n]?e[r++]:s[n];return o.join("\n")},ViewAbstraction.prototype.appendToNodeFilter=function(t){var t=this.getNodeFilter("expression")+" "+t;this.setNodeFilter(t)},ViewAbstraction.prototype.getEdgeStoreLocation=function(){return this.isConfEnabled("private_edge_mode")?this.getRoot()+"/graph/edges":this.opt.path.edges},ViewAbstraction.prototype.getAllEdgesFilterExpr=function(t){var i=t?"removeprefix["+this.getEdgeStoreLocation()+"/]":"";return"[prefix["+this.getEdgeStoreLocation()+"]"+i+"]"},ViewAbstraction.prototype.getEdgeFilter=function(t,i){if(!i&&this.edgeFilter)var e=this.edgeFilter;else{var e=utils.getEmptyMap();e.expression=function(){var t=[];t.push("prefix["+this.getEdgeStoreLocation()+"]");var i=$tw.wiki.getTiddler(this.path.edgeFilter);if(i){var e=utils.getPropertiesByPrefix(i.fields,"show-",!0);for(var s in e)"false"===e[s]&&t.push("!field:id["+s+"]")}return"["+t.join("")+"]"}.call(this),e.compiled=this.wiki.compileFilter(e.expression)}return t?e[t]:e},ViewAbstraction.prototype.getNodeFilter=function(t,i){if(!i&&this.nodeFilter)var e=this.nodeFilter;else{var e=utils.getEmptyMap(),s=$tw.wiki.getTiddler(this.path.nodeFilter);e.expression=s&&"string"==typeof s.fields.filter?s.fields.filter:"",e.compiled=this.wiki.compileFilter(e.expression)}return t?e[t]:e},ViewAbstraction.prototype.getPositions=function(t){return!t&&this.positions?this.positions:$tw.wiki.getTiddlerData(this.path.map,{})},ViewAbstraction.prototype.setPositions=function(t){this.exists()&&($tw.taskgraph.logger("log",'Storing positions in view "'+this.getLabel()+'"'),"object"==typeof t&&(this.wiki.setTiddlerData(this.path.map,t),this.positions=t,this._ignoreOnNextRebuild[this.path.map]=!0))},ViewAbstraction.prototype.setNodePosition=function(t){if(t&&t.x&&t.y){var i=this.getPositions();i[t.id]={x:t.x,y:t.y},this.setPositions(i)}},exports.ViewAbstraction=ViewAbstraction;