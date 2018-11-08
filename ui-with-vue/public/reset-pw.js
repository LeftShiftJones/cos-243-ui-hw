console.log("Loaded reset logic");

// Define components _before_ creating the Vue object.
Vue.component('sign-up-static-heading', {
    template: '<h2>Fancier Sign-Up Page</h2>'
});

Vue.component('instructions', {
    props: ['details'],
    template: '<p><strong>Instructions</strong>: {{ details }}</p>'
});

Vue.component('error-msge', {
    props: ['msge', 'severity'],
    template: `<div class="alert" v-bind:class="'alert-' + severity">{{ msge }}</div>`//define div class to show up
});

function validate(password, message_list, message) {
    if (!password.length) {
        message_list.push({
            severity: 'danger',
            msge: `${message} must not be empty`
        })
    } else {
        if (!password.match(/[A-Z]/)) {
            message_list.push({
                severity: 'warning',
                msge: `${message} requires at least one upper-case letter`
            });
        }

        if (!password.match(/[a-z]/)) {
            message_list.push({
                severity: 'warning',
                msge: `${message} requires at least one lower-case letter`
            });
        }

        if (!password.match(/[0-9]/)) {
            message_list.push({
                severity: 'warning',
                msge: `${message} requires at least one digit`
            });
        }

        if (password.length < 8) {
            message_list.push({
                severity: 'danger',
                msge: 'Password must be at least eight characters long'
            });
        }
    }
}

let resetPassword = new Vue({
    el: '#reset-pw-page',
    data: {
        old_password: '',
        new_password: '',
        pw_confirm: ''
    },
    computed: {
        errors: function () {
            let messages = [];
            validate(this.old_password, messages, 'Old Password');
            validate(this.new_password, messages, 'New Password');
            validate(this.pw_confirm, messages, 'Confirm Password');
            if(this.old_password.length && (this.old_password == this.new_password)) {
                messages.push ({
                    severity: 'danger',
                    msge: 'New password must be different from old password'
                });
            }
            if(!(this.new_password == this.pw_confirm)) {
                messages.push({
                    severity: 'danger',
                    msge: 'New passwords must match'
                });
            }
            if(messages.length) {
                document.getElementsByTagName('input')[3].disabled = true;
            } else {
                document.getElementsByTagName('input')[3].disabled = false;
            }
            return messages;
        }
    }
});