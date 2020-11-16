# Gmail-Phish-Addon
A Google Workspace add-on that generated phishing reports.

*This was hastly createdto provide a standard cross-platform method of reporting phishing emails.*

![Integrated directly into Gmail](WebReport.gif)

![Similarly works in the Gmail mobile app.](MobileReport.gif)



# Installing (in dev/your profile)
- Create a new project on your [Google Apps Script dashboard](https://script.google.com/home).
- Enable manifest: `View -> Show manifest file`
- Paste the script from `Code.gs` into the `Code.gs` file in the editor.
- Save your project.

# Testing
To publish the add-on, `Publish -> Deploy from manifest`. Select `Install add-on`.


# Deploying production
To deploy this to your Google Workspace's domain, you'll need to create a [cloud project](https://console.cloud.google.com/). I do not have exact deployment details for you, you can review that on this guide: [Google Cloud Platform Projects
](https://developers.google.com/apps-script/guides/cloud-platform-projects).
