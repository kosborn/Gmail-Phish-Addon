/**
 * Simple add-on to report suspected phishing. Cross platform, supporterd on desktop & mobile.
 *
 * Butchered from https://developers.google.com/gsuite/add-ons/cats-quickstart
 *
 * Icon from https://www.iconfinder.com/icons/2427851/fish_fishing_food_sea_sea_creature_icon
 *
 */


// Contact button information
supportText = "Contact IT Security"
supportLink = "mailto:IT_SUPPORT@EXAMPLE.COM?subject=Phish+Plugin" // ! Update this !


// Phish report messages
reportPhishHeader = "Thanks for the report!" 
reportPhishMessage = "Thank you for helping keep [our company] safe!<br/><br/>IT may contact you if there is any follow-up required."

// Reprot information
reportEmail = "PHISHING@EXAMPLE.COM" // ! Update this !
reportSubjectPrefix = "[Phishing Report] "

// Simulated phish testing information
simulatedPhishText = "That was a simulated phishing attack, you caught it! 🎉<br/><br/>Thank you for your continuous efforce in keeping [our company] safe!"
simulatedPhishHeaders = [] // If your simulated phishing campaigns have unique email headers, fill them out here.



/**
 * Callback for rendering the homepage card.
 * @return {CardService.Card} The card to show to the user.
 */
function onHomepage(e) {
  //console.log(e);
  var message;
  message = "Open an email to report it.";
  return createPhishCardHomepage(message, true);
}

/**
 * Creates a card with information about the email(s) being submitted for phishing.
 */
function createPhishCardHomepage(text, isHomepage) {
  // Create a button that reports the opened, or selected, emails.
  // Note: Action parameter keys and values must be strings.
  var action = CardService.newAction()
      .setFunctionName('onReportPhishMulti')
      .setParameters({isHomepage: "true"});
  var button = CardService.newTextButton()
      .setText('Report Phish')
      .setOnClickAction(action)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var buttonSet = CardService.newButtonSet()
      .addButton(button);

  // Create a footer to be shown at the bottom.
  var footer = CardService.newFixedFooter()
      .setPrimaryButton(CardService.newTextButton()
          .setText(supportText)
          .setOpenLink(CardService.newOpenLink()
                       .setUrl(supportLink)));

  var message = CardService.newTextParagraph()
      .setText(text);


  // Assemble the widgets and return the card.
  var section = CardService.newCardSection()
      .addWidget(message);
      //.addWidget(buttonSet);
  var card = CardService.newCardBuilder()
      .addSection(section)
      .setFixedFooter(footer);

  if (!isHomepage) {
    // Create the header shown when the card is minimized,
    // but only when this card is a contextual card. Peek headers
    // are never used by non-contexual cards like homepages.
    var peekHeader = CardService.newCardHeader()
      .setTitle('Phish Report')
      .setImageUrl('https://cdn3.iconfinder.com/data/icons/food-set-3/91/Food_C205-256.png')
      .setSubtitle(text);
    card.setPeekCardHeader(peekHeader)
  }

  return card.build();
}


function createPhishCardReport(details) {
  
  var header = CardService.newCardHeader()
    .setTitle('Report this email?')
  // Create text input for optional comment.
  var input = CardService.newTextInput()
    .setFieldName('optional')
    .setTitle('What looks suspicious?')
    .setHint('Unfamiliar sender? Unexpected file? [OPTIONAL]');

  // Create a button that reports the opened, or selected, emails.
  // Note: Action parameter keys and values must be strings.
  var action = CardService.newAction()
      .setFunctionName('onReportPhish')
  .setParameters({details: JSON.stringify(details), isHomepage: "false"});
  
  var button = CardService.newTextButton()
      .setText('Send Report')
      .setOnClickAction(action)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  
  var buttonSet = CardService.newButtonSet()
      .addButton(button);

  // Create a footer to be shown at the bottom.
  var footer = CardService.newFixedFooter()
      .setPrimaryButton(CardService.newTextButton()
          .setText(supportText)
          .setOpenLink(CardService.newOpenLink()
           .setUrl(supportLink)));

  var reportDetails = CardService.newTextParagraph().setText("Is this email supcious looking?"+
                                                            "<br/><b>Subject: </b>"+details['subject']+
                                                            "<br/><b>Sender: </b>"+details['from']);
  

  // Assemble the widgets and return the card.
  var section = CardService.newCardSection()
      .addWidget(reportDetails)
      .addWidget(input)
      .addWidget(buttonSet);
  var card = CardService.newCardBuilder()
      .setHeader(header)
      .addSection(section)
      .setFixedFooter(footer);

  return card.build();
}

function createPhishCardPostReport(phishTest) {

  if(phishTest){
    var header = CardService.newCardHeader()
    .setTitle(reportPhishHeader)

    var thanks = CardService.newTextParagraph()
    .setText(simulatedPhishText);
  } else {
     var header = CardService.newCardHeader()
    .setTitle(reportPhishHeader)
    
     var thanks = CardService.newTextParagraph()
     .setText(reportPhishMessage);
  }
   
  // Create a footer to be shown at the bottom.
  var footer = CardService.newFixedFooter()
      .setPrimaryButton(CardService.newTextButton()
      .setText(supportText)
      .setOpenLink(CardService.newOpenLink()
      .setUrl(supportLink)));

  // Assemble the widgets and return the card.
  var section = CardService.newCardSection()
      .addWidget(thanks)
  var card = CardService.newCardBuilder()
      .setHeader(header)
      .addSection(section)
      .setFixedFooter(footer);

  return card.build();
}

/**
 * Callback for the "Report phish" button.
 */
function onReportPhish(e) {
  details = JSON.parse(e.parameters.details);
  var emailAsAttachment = Utilities.newBlob(details['original']);
  var headers = details['original'].split("\r\n\r\n")[0];
  
  if(!details['phishTest']){
    GmailApp.sendEmail(reportEmail, reportSubjectPrefix + details['subject'], "Submitted email:\n\n"+details['plain']+"\n\n\n\nEmail headers:\n\n"+headers, { attachments: [emailAsAttachment.setName(details.messageId+".eml")], htmlBody: "<h2>Submitted email:</h2><br/><br/><pre>"+details['plain']+"</pre><br/><br/><br/><h2>Email headers:</h2><br/><br/><pre>"+headers+"</pre>"});  
  } else {
    // no need to send email for a phishing test. 
  }
  // Create a new card with the same text.
  var card = createPhishCardPostReport(details['phishTest']);

  // Create an action response that instructs the add-on to replace
  // the current card with the new one.
  var navigation = CardService.newNavigation()
      .updateCard(card);
  var actionResponse = CardService.newActionResponseBuilder()
      .setNavigation(navigation);
  return actionResponse.build();
}



/**
 * Callback for rendering the card for a specific Gmail message.
 * @param {Object} e The event object.
 * @return {CardService.Card} The card to show to the user.
 */
function onGmailMessage(e) {
  //console.log(e);

  reportDetails = {};
  
  // Get the ID of the message the user has open.
  var messageId = e.gmail.messageId;

  // Get an access token scoped to the current message and use it for GmailApp
  // calls.
  var accessToken = e.gmail.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  // Get the subject of the email.
  var message = GmailApp.getMessageById(messageId);
  var subject = message.getThread().getFirstMessageSubject();
  
  // Get some more mail information
  var from = message.getFrom();
  var original = message.getRawContent();
  var plain = message.getPlainBody();
  
  // Check if it's a phish test
  var phishTest = false;
  console.log(simulatedPhishHeaders);
  simulatedPhishHeaders.forEach(function(h) {
    console.log(message.getHeader(h));
    if(message.getHeader(h) != ""){
      console.log("Phish Test True");
      phishTest = true;
    }
  })
  console.log("phishTest"+phishTest);
  
  // Remove labels and prefixes.
  subject = subject
      .replace(/^([rR][eE]|[fF][wW][dD])\:\s*/, '')
      .replace(/^\[.*?\]\s*/, '');

  reportDetails = {messageId: messageId,
                   subject: subject,
                   from: from,
                   original: original,
                   plain: plain,
                   phishTest: phishTest
                  }
  
  return createPhishCardReport(reportDetails);
}

