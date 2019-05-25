
// Traitement Data from Linkedin to Marketo
            $user="";
            $company="";
            $mkto=false;
            var info;


            // Setup an event listener to make an API call once auth is complete
            function onLinkedInLoad() {
                
                IN.Event.on(IN, "auth", getProfileData);

                
            }

            // Handle the successful return from the API call
            function onSuccess(data) {
               ConversationalForm.addRobotChatResponse(data.firstName + ", nous avons bien enregistré votre inscription ");
               ConversationalForm.addRobotChatResponse("N'oubliez pas de partager cet événement ! 🙌 <br/><br/><a href='https://www.linkedin.com/shareArticle?mini=false&url=http://nxt.theoryglobal.com&title=nXT%20Marketing:%20Une%20matin%C3%A9e%20pour%20pr%C3%A9parer%20maintenant%20le%20futur%20du%20marketing%20B2B&summary=Le%2023%20mai%20%C3%A0%20l%27American%20Chamber%20Of%20Commerce%20in%20France&source=TheoryGlobal' target='_blank' style='background-color: #0077B5;padding: 10px 5px 5px 8px;border-radius: 5px;font-size: 10px !mportant;'><i class='fa fa-linkedin fa-2x' aria-hidden='true' style='color:#fff'></i>&nbsp;</a>&nbsp;&nbsp;<a href='https://twitter.com/intent/tweet?url=https%3A%2F%2Fnxt.theoryglobal.com&hashtags=nXTMarketing,marketingB2B&text=Une%20matinée%20pour%20apprendre,%20échanger,%20anticiper%20demain%20😀%20%20pic.twitter.com/JlgUE9rthJ' target='_blank' style='background-color: #55acee;padding: 10px 5px 5px 8px;border-radius: 5px;font-size: 10px !mportant;'><i class='fa fa-twitter fa-2x' aria-hidden='true' style='color:#fff'></i>&nbsp;</a>");

                info=data;
                populate(info,0);
            }


            function populate(data,i){
                var time=new Date();
                
                $("#company").attr("cf-questions", data.firstName);

                
                $('#user').text(data.formattedName);
                $user="EmailAddress="+data.emailAddress+"&FirstName="+data.firstName+"&LastName="+data.lastName+"&Title="+data.positions.values[i].title+"&Company="+data.positions.values[i].company.name+"&Country="+data.location.country.code+"&Industry="+data.positions.values[i].company.industry+"&Date="+time;
                $company=data.positions.values[i].company.name;


                //Populate the form that appears
                $('#inputprenom').val(data.firstName);
                $('#inputnom').val(data.lastName);
                $('#inputfonction').val(data.positions.values[0].title);
                $('#inputentreprise').val(data.positions.values[0].company.name);

                //Populate Marketo Form that is not visible
                $('#FirstName').val(data.firstName);
                $('#LastName').val(data.lastName);
                $('#Title').val(data.positions.values[i].title);
                $('#Company').val(data.positions.values[i].company.name);
                $('#MarketoSocialLinkedInProfileURL').val(data.publicProfileUrl);
                $('#City').val(data.location.name);
                $('#Country').val(data.location.country.code);
                $('#MarketoSocialLinkedInDisplayName').val(data.formattedName);
                $('#Industry').val(data.positions.values[i].company.industry.replace(', ','-'));
                $('#Role').val(data.positions.values[i].summary);
                $('#mkgOrigin').val('Breakfast Nxt Marketing');
                $('#MarketoSocialLinkedInPhotoURL').val(data.pictureUrls.values[0]);
                MktoForms2.whenReady(function (form) {
                                                                    form.submit();
                                                                }); 
                // Add Option to #cie field when user has multiple job
                var obj = info.positions.values;
                jQuery.each(obj, function(j, val) {
                    $('#cie').append(new Option(val.company.name, j, false, false));});
                
                
                // Bind the choice of the user 
                $("#cie").bind("change", function(){
                    updateform(info,$('select option:selected').val());
                });

                // Bind the focus out event to evaluate if the email address is business one
                $("#emailAddress").bind("focusout", function(){
                    $('#Email').val($('#emailAddress').val());
                    if(isBusinessEmail($('#Email').val())){
                        $mkto=true;
                    }
                    else{
                        $mkto=false;
                    }
                });
            }

            
            function updateform(data,i){

                //when the user update its current company
                $('#user').text(data.formattedName);
                $('#FirstName').val(data.firstName);
                $('#LastName').val(data.lastName);
                $('#Title').val(data.positions.values[i].title);
                $('#Company').val(data.positions.values[i].company.name);
                $('#MarketoSocialLinkedInProfileURL').val(data.publicProfileUrl);
                $('#City').val(data.location.name);
                $('#Country').val(data.location.country.code);
                $('#MarketoSocialLinkedInDisplayName').val(data.formattedName);
                $('#Industry').val(data.positions.values[i].company.industry);
                $('#Role').val(data.positions.values[i].summary);
                $('#mkgOrigin').val('Breakfast Nxt Marketing');
                $('#MarketoSocialLinkedInPhotoURL').val(data.pictureUrls.values[0]);
                var time=new Date();

                $company=data.positions.values[i].company.name;
                $user="EmailAddress="+data.emailAddress+"&FirstName="+data.firstName+"&LastName="+data.lastName+"&Title="+data.positions.values[i].title+"&Company="+data.positions.values[i].company.name+"&Country="+data.location.country.code+"&Industry="+data.positions.values[i].company.industry+"&Date="+time;

                

            }
            function isEmail(sEmail) {
                var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                if (filter.test(sEmail)) {
                    return true;
                }else {
                    return false;
                };
            }
            function isBusinessEmail(sEmail) {
                var filter = /[a-zA-Z0-9_\.+]+@(gmail|yahoo|hotmail)(\.[a-z]{2,3}){1,2}/;
                if (filter.test(sEmail)) {
                    return false;
                }else {
                    if (isEmail(sEmail)){
                        return true;}
                        else{
                            return false;
                        }
                    };
                }

            // Handle an error response from the API call
            function onError(error) {

                console.log(error);
            }



            // Use the API call wrapper to request the member's basic profile data
            function getProfileData() {
                IN.API.Raw("/people/~:(first-name,last-name,headline,summary,picture-urls::(original),specialties,formatted-name,location,picture-url,email-address,positions,public-profile-url)").result(onSuccess).error(onError);
            }



// Docs version 1.0.0
// declare module cf{
//  
// }
// interface cf{
//  ConversationalForm: any;
// }
// export type ConversationalForm = any;
// interface ConversationalForm = any;
// declare var ConversationalForm: any;
// can be overwritten


var ConversationalForm = (function () {
    function ConversationalForm() {
    }
    return ConversationalForm;
}());
var ConversationalFormDocs = (function () {
    function ConversationalFormDocs() {
        this.introTimer = 0;
        this.el = document.getElementById("conversational-form-docs");
        this.h1writer = new H1Writer({
            el: document.getElementById("writer")
        });
        var isMenuVisible = window.getComputedStyle(document.getElementById("small-screen-menu")).getPropertyValue("display") != "none";
        if (isMenuVisible)
            this.introFlow1();
        else
            this.introFlow2();
    }
    /**
    * @name introFlow1
    * flow for small screens
    */
    ConversationalFormDocs.prototype.introFlow1 = function () {
        var _this = this;
        this.introTimer = setTimeout(function () {
            _this.toggleMenuState();
            _this.h1writer.start();
            _this.introTimer = setTimeout(function () {
                _this.toggleConversation();
            }, 3000);
        }, 1000);
    };
    /**
    * @name introFlow2
    * flow for larger screens
    */
    ConversationalFormDocs.prototype.introFlow2 = function () {
        var _this = this;
        this.h1writer.start();
        this.introTimer = setTimeout(function () {
            document.getElementById("info").classList.add('show');
            _this.introTimer = setTimeout(function () {
                document.getElementById("form").classList.add('show');
                document.getElementById("cf-toggle-btn").classList.add('show');
                _this.introTimer = setTimeout(function () {
                    _this.toggleConversation();
                }, 0);
            }, 1500);
        }, 1000);
    };
    ConversationalFormDocs.prototype.toggleMenuState = function () {
        var open = this.el.classList.toggle('menu-toggle', !this.el.classList.contains('menu-toggle'));
        if (open) {
            this.el.classList.remove('cf-toggle');
        }
        return false;
    };

    var testValidation = function(dto, success, error){
                console.log("testValidation, dto:", dto);
                if(dto.text.indexOf(".com") != -1)
                    return success();
                return error();
            };

    ConversationalFormDocs.prototype.toggleConversation = function () {
        var _this = this;
        clearTimeout(this.introTimer);
        if (!this.el.classList.contains('cf-toggle')) {
            if (!this.cf) {
                this.cf = new window.cf.ConversationalForm({
                    formEl: document.getElementById("cf-form"),
                    context: document.getElementById("cf-context"),
                    dictionaryData: {
            "user-image": "//conversational-form-static-0iznjsw.stackpathdns.com/src/images/human.png",
            "entry-not-found": "Dictionary item not found.",
            "input-placeholder": "Écrire ici votre réponse ...",
            "group-placeholder": "Cliquez sur un élément de la liste ...",
            "input-placeholder-error": "Votre entrée n'est pas correcte ...",
            "input-placeholder-required": "Une réponse est requise ...",
            "input-placeholder-file-error": "File upload failed ...",
            "input-placeholder-file-size-error": "File size too big ...",
            "input-no-filter": "No results found for <strong>{input-value}</strong>",
            "user-reponse-and": " and ",
            "user-reponse-missing": "Missing input ...",
            "user-reponse-missing-group": "Nothing selected ...",
            "general": "General type1|General type2",
            "icon-type-file": "<svg class='cf-icon-file' viewBox='0 0 10 14' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g transform='translate(-756.000000, -549.000000)' fill='#0D83FF'><g transform='translate(736.000000, 127.000000)'><g transform='translate(0.000000, 406.000000)'><polygon points='20 16 26.0030799 16 30 19.99994 30 30 20 30'></polygon></g></g></g></g></svg>",
        },
                    dictionaryRobot:{
            "user-image": "//conversational-form-static-0iznjsw.stackpathdns.com/src/images/human.png",
            "entry-not-found": "Dictionary item not found.",
            "input-placeholder": "Écrire ici votre réponse ...",
            "group-placeholder": "Cliquez sur un élément de la liste ...",
            "input-placeholder-error": "Your input is not correct ...",
            "input-placeholder-required": "Input is required ...",
            "input-placeholder-file-error": "File upload failed ...",
            "input-placeholder-file-size-error": "File size too big ...",
            "input-no-filter": "No results found for <strong>{input-value}</strong>",
            "user-reponse-and": " and ",
            "user-reponse-missing": "Missing input ...",
            "user-reponse-missing-group": "Nothing selected ...",
            "general": "General type1|General type2",
            "icon-type-file": "<svg class='cf-icon-file' viewBox='0 0 10 14' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g transform='translate(-756.000000, -549.000000)' fill='#0D83FF'><g transform='translate(736.000000, 127.000000)'><g transform='translate(0.000000, 406.000000)'><polygon points='20 16 26.0030799 16 30 19.99994 30 30 20 30'></polygon></g></g></g></g></svg>",
        },
                    robotImage: "https://s3-eu-west-1.amazonaws.com/pixbucket/event/robot3.png",
                    userImage: "https://s3-eu-west-1.amazonaws.com/pixbucket/event/user.png",
                    submitCallback: function () {
                        
                    },
                    flowStepCallback: function (dto, success, error) {

                        if(dto.text.indexOf("Linkedin") != -1){ 
                            
                            IN.User.authorize(onLinkedInLoad);


                            

                         }

                         

                        if(dto.text.indexOf("@") != -1 || dto.input.currentTag.value[0].indexOf("@") != -1){
                            if(isBusinessEmail(dto.text)|| isBusinessEmail(dto.input.currentTag.value[0])){
                            $("#Email").val(dto.text);
                            success();
                         }else{
                            error();
                         }
                            
                        }


                        if (dto.input.currentTag.domElement) {
                            
                            if (dto.input.currentTag.domElement.getAttribute("name") == "email") {
                                
                            }
                            else if (dto.input.currentTag.domElement.getAttribute("name") == "submit-form") {
                                var xhr = new XMLHttpRequest();
                                xhr.addEventListener("load", function () {
                                    _this.cf.addRobotChatResponse("Nous avons enregistré votre instription 🙌");
                                    success();
                                });
                                xhr.open('POST', document.getElementById("cf-form").getAttribute("action"));
                                xhr.setRequestHeader("accept", "application/javascript");
                                xhr.setRequestHeader("Content-Type", "application/json");
                                xhr.send(JSON.stringify(_this.cf.getFormData(true)));
                            }
                            else {
                                success();
                            }
                        }
                        else {
                            success();
                        }
                    }
                });
            }
            if (this.cf.focus)
                this.cf.focus();
            setTimeout(function () {
                _this.el.classList.remove('menu-toggle');
                _this.el.classList.add('cf-toggle');
            }, 1);
        }
        else {
            this.el.classList.remove('cf-toggle');
        }
        return false;
    };
    ConversationalFormDocs.start = function () {
        if (!ConversationalFormDocs.instance)
            window.conversationalFormDocs = new ConversationalFormDocs();
    };
    return ConversationalFormDocs;
}());



var H1Writer = (function () {
    function H1Writer(options) {
        this.progress = 0;
        this.progressTarget = 0;
        this.str = "";
        this.strs = ["...", "nXT Marketing"];
        this.step = 0;
        this.el = options.el;
        this.el.innerHTML = "";
        this.el.classList.add("show");
    }
    H1Writer.prototype.start = function () {
        this.progress = 0;
        this.progressTarget = 1;
        this.str = this.strs[this.step];
        this.render();
    };
    H1Writer.prototype.nextStep = function () {
        if (this.progressTarget == 0) {
            this.step++;
        }
        this.str = this.strs[this.step];
        this.progressTarget = this.progressTarget == 0 ? 1 : 0;
        this.render();
    };
    H1Writer.prototype.render = function () {
        var _this = this;
        this.progress += (this.progressTarget - this.progress) * (this.step == 0 ? 0.15 : 0.09);
        var out = this.str.substr(0, Math.round(this.progress * this.str.length));
        this.el.innerHTML = out;
        if (Math.abs(this.progress - this.progressTarget) <= 0.01) {
            cancelAnimationFrame(this.rAF);
            if (this.step < 1) {
                setTimeout(function () {
                    _this.nextStep();
                }, 100);
            }
        }
        else
            this.rAF = window.requestAnimationFrame(function () { return _this.render(); });
    };
    return H1Writer;
}());
if (document.readyState == "complete") {
    // if document alread instantiated, usually this happens if Conversational Form is injected through JS
    ConversationalFormDocs.start();
}
else {
    // await for when document is ready
    window.addEventListener("load", function () {
        ConversationalFormDocs.start();
    }, false);
}