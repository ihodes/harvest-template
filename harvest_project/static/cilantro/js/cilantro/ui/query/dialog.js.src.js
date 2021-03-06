/* global define */

define([
    'underscore',
    'marionette',
], function(_, Marionette) {

    var DeleteQueryDialog = Marionette.ItemView.extend({
        className: 'modal hide',

        template: 'query/delete-dialog',

        options: {
            header: 'Delete Query'
        },

        events: {
            'click .delete-query-button': 'deleteQuery'
        },

        ui: {
            header: '.modal-header h4',
            alert: '.alert'
        },

        showError: function(message) {
            this.ui.alert.html(message).show();
        },

        hideError: function() {
            this.ui.alert.hide();
        },

        deleteQuery: function() {
            this.hideError();

            // Re-open on failure and display error message. Closure reference
            // of model put to prevent re-opening with a new instance
            var model = this.model, _this = this;

            this.model.destroy().fail(function() {
                _this.open(model);

                // TODO evaluate the error and customize the message, e.g. don't
                // tell a user to try again if there is no hope.
                _this.showError('Sorry, there was a problem deleting your query. ' +
                                'Please try again.');
            });

            this.close();
        },

        onRender: function() {
            this.ui.header.text(this.options.header);

            this.$el.modal({
                show: false,
                keyboard: false,
                backdrop: 'static'
            });
        },

        open: function(model) {
            this.hideError();
            this.model = model;
            this.$el.modal('show');
        },

        close: function() {
            delete this.model;
            this.$el.modal('hide');
        }
    });

    var EditQueryDialog = Marionette.ItemView.extend({
        className: 'modal hide',

        template: 'query/edit-dialog',

        options: {
            header: 'Query Properties'
        },

        events: {
            'click [data-save]': 'saveQuery'
        },

        ui: {
            header: '.modal-header h4',
            alert: '.alert',
            name: '.query-name',
            description: '.query-description',
            email: '.query-emails',
            publicity: '.query-publicity'
        },

        initialize: function() {
            this.data = {};

            if (!(this.data.context = this.options.context)) {
                throw new Error('context model required');
            }

            if (!(this.data.view = this.options.view)) {
                throw new Error('view model required');
            }
        },

        showError: function(message) {
            this.ui.alert.html(message).show();
        },

        hideError: function() {
            this.ui.alert.hide();
        },

        saveQuery: function() {
            this.hideError();

            // Make sure the name is valid, everything else can be left blank
            if (!this.ui.name.val()) {
                this.showError('Please supply a name for the query');
                return;
            }

            // Extract data from form and session
            var attrs = {
                name: this.ui.name.val(),
                description: this.ui.description.val(),
                usernames_or_emails: this.ui.email.val(), // jshint ignore:line
                public: this.ui.publicity.prop('checked')
            };

            // Create a new model if not defined
            if (!this.model) {
                this.model = new this.collection.model();

                // We only want to set the context and view json if this is a
                // new saved query. Otherwise, we would be stomping on the saved
                // context and view with whatever the user currently has in
                // their session.
                attrs.context_json = this.data.context.toJSON().json; // jshint ignore:line
                attrs.view_json = this.data.view.toJSON().json; // jshint ignore:line
            }

            // Don't stomp on model's collection if it already exists in one
            if (!this.model.collection) {
                this.collection.add(this.model);
            }

            // Re-open on failure and display error message. Closure reference
            // of model put to prevent re-opening with a new instance
            var model = this.model, _this = this;

            this.model.save(attrs).fail(function() {
                _this.open(model);

                // TODO evaluate the error and customize the message, e.g. don't
                // tell a user to try again if there is no hope.
                _this.showError('Sorry, there was a problem saving your query. ' +
                                'Please try again.');
            });

            this.close();
        },

        onRender: function() {
            this.ui.header.text(this.options.header);

            this.$el.modal({
                show: false,
                keyboard: false,
                backdrop: 'static'
            });
        },

        open: function(model) {
            this.hideError();
            this.model = model;

            var name, description, emails, publicity;

            // Repopulate modal with model attributes, otherwise initialize
            // with defaults
            if (model) {
                name = this.model.get('name');
                description = this.model.get('description');
                emails = _.pluck(this.model.get('shared_users'), 'email').join(', ');
                publicity = this.model.get('public');
            }
            else {
                // Remove timezone info from the current date and then use it as
                // the suffix for new query title.
                var fields = Date().toString().split(' ');

                name = 'Query on ' + fields.slice(0, 5).join(' ');
                description = '';
                emails = '';
                publicity = false;
            }

            // Reset form fields
            this.ui.name.val(name);
            this.ui.description.val(description);
            this.ui.email.val(emails);
            this.ui.publicity.prop('checked', publicity);

            this.$el.modal('show');
        },

        close: function() {
            delete this.model;
            this.$el.modal('hide');
        }
    });

    return {
        DeleteQueryDialog: DeleteQueryDialog,
        EditQueryDialog: EditQueryDialog
    };

});
