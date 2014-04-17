var __hasProp={}.hasOwnProperty,__extends=function(t,e){function i(){this.constructor=t}for(var n in e)__hasProp.call(e,n)&&(t[n]=e[n]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t};define(["underscore","backbone","../core","./base"],function(t,e,i,n){var s,o,r,a,u,h,l;return s=function(t){function e(){return u=e.__super__.constructor.apply(this,arguments)}return __extends(e,t),e.prototype.idAttribute="concept",e}(e.Model),o=function(t){function e(){return h=e.__super__.constructor.apply(this,arguments)}return __extends(e,t),e.prototype.model=s,e}(e.Collection),a=function(e){function n(){this.facets=new o,this.on("change:json",function(t,e){return this.jsonToFacets(e)}),n.__super__.constructor.apply(this,arguments)}return __extends(n,e),n.prototype.initialize=function(){var t=this;return this.on("request",function(){return i.trigger(i.VIEW_SYNCING,this)}),this.on("sync",function(t,e,n){return null==n&&(n={}),n.silent!==!0?i.trigger(i.VIEW_SYNCED,this,"success"):void 0}),this.on("error",function(){return i.trigger(i.VIEW_SYNCED,this,"error")}),this.on("change",function(){return i.trigger(i.VIEW_CHANGED,this)}),i.on(i.VIEW_SAVE,function(e){return t.id===e||!e&&t.isSession()?t.save():void 0})},n.prototype.isSession=function(){return this.get("session")},n.prototype.isArchived=function(){return this.get("archived")},n.prototype.toJSON=function(){var t;return t=n.__super__.toJSON.apply(this,arguments),t.json=this.facetsToJSON(),t},n.prototype.parse=function(t){return n.__super__.parse.apply(this,arguments),this.jsonToFacets(t.json),t},n.prototype.jsonToFacets=function(e){var i,n,s,o,r,a,u,h,l,c,p,d,f;if(t.isArray(e))return this.facets.reset(e),void 0;for(r=[],n=e.columns||[],a=e.ordering||[],h=0,p=n.length;p>h;h++){for(o=n[h],i={concept:o},s=c=0,d=a.length;d>c;s=++c)f=a[s],l=f[0],u=f[1],o===l&&(i.sort=u,i.sort_index=s);r.push(i)}return this.facets.reset(r)},n.prototype.facetsToJSON=function(){var t;return t={ordering:[],columns:[]},this.facets.each(function(e){var i,n,s;return t.columns.push(e.get("concept")),(i=e.get("sort"))?(n=e.get("sort_index"),s=[e.get("concept"),i],t.ordering.splice(n,0,s)):void 0}),t},n}(n.Model),r=function(t){function e(){return l=e.__super__.constructor.apply(this,arguments)}return __extends(e,t),e.prototype.model=a,e}(n.SessionCollection),{ViewModel:a,ViewCollection:r}});
//@ sourceMappingURL=view.js.map