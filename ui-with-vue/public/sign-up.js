console.log("Loaded sign-up logic");

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

// Control...     If true   If false
// ----------------------------------
// Been visited   touched   untouched
// Has changed	  dirty     pristine
// Is valid       valid     invalid

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
            validate(old_password, messages, 'Old Password');
            validate(new_password, messages, 'New Password');
            validate(pw_confirm, messages, 'Confirm Password');
            if(messages.length) {
                document.getElementsByTagName('input')[0].disabled = true;
            } else {
                document.getElementsByTagName('input')[0].disabled = false;
            }
            return messages;
        }
    }
});

// Create a new Vue object attached to the sign-up form.
let signUp = new Vue({
    el: '#sign-up-page',
    data: {
        email: '',
        password: ''
    },
    computed: {
        errors: function () {
            let messages = [];
            if (!this.email.length) {
                messages.push({
                    severity: 'danger',
                    msge: 'Email must not be empty'
                })
            } else if (!this.email.match(/^\w+@\w+\.\w{2,}$/)) {
                messages.push({
                    severity: 'danger',
                    msge: `'${this.email}' is an invalid email address`
                });
            }
            validate(this.password, messages, 'Password');

            // if (!this.password.length) {
            //     messages.push({
            //         severity: 'danger',
            //         msge: 'Password must not be empty'
            //     })
            // } else {
            //     if (!this.password.match(/[A-Z]/)) {
            //         messages.push({
            //             severity: 'warning',
            //             msge: 'Password requires at least one upper-case letter'
            //         });
            //     }

            //     if (!this.password.match(/[a-z]/)) {
            //         messages.push({
            //             severity: 'warning',
            //             msge: 'Password requires at least one lower-case letter'
            //         });
            //     }

            //     if (!this.password.match(/[0-9]/)) {
            //         messages.push({
            //             severity: 'warning',
            //             msge: 'Password requires at least one digit'
            //         });
            //     }

            //     if (this.password.length < 8) {
            //         messages.push({
            //             severity: 'danger',
            //             msge: 'Password must be at least eight characters long'
            //         });
            //     }
            // }
            if(messages.length) {
                document.getElementsByTagName('input')[2].disabled = true;
            } else {
                document.getElementsByTagName('input')[2].disabled = false;
            }
            return messages;
        }
    }
});
