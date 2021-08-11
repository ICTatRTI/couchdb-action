const pouchdb = require('pouchdb')

async function go() {
  const db = new pouchdb(process.env.URL)
  const doc = await db.get(process.env.DOC_ID)
  if (doc.type === 'case' ) {
    const study_id_input = doc.items[0].inputs.find(input => input.name === 'study_id')
    if (study_id_input) {
      const study_id = study_id_input.value
      if (study_id !== 'STUDY_ID') {
        // change the study_id in the case
        doc.items[0].inputs.find(input => input.name === 'study_id').value = 'STUDY_ID'
        doc.participants[0].data.study_id = 'STUDY_ID'
        try {
          await db.put(doc)
          console.log(`Changed Study ID in Case`)
        } catch (err) {
          console.log(`error saving case doc: ${err.message}`)
          return -1
        }

        // Loop through existing form response docs and change the study_id
        const caseEvents = doc.events
        for (const caseEvent of caseEvents) {
          const eventForms = caseEvent.eventForms
          for (const eventForm of eventForms) {
            const formResponseId = eventForm.formResponseId
            if (formResponseId) {
              console.log(`Form Response: ${formResponseId}`)
              // Save the form response from the dev group to the prod group
              const formResponseDoc = await db.get(formResponseId)
              const form_SUBJID_input = formResponseDoc.items[0].inputs.find(input => input.name === 'SUBJID')
              if (form_SUBJID_input) {
                const SUBJID = form_SUBJID_input.value
                if (SUBJID !== 'STUDY_ID') {
                  // change the study_id in the form
                  formResponseDoc.items[0].inputs.find(input => input.name === 'SUBJID').value = 'STUDY_ID'
                }
              }
              const form_subjid_entered_input = formResponseDoc.items[0].inputs.find(input => input.name === 'subjid_entered')
              if (form_subjid_entered_input) {
                const subjid_entered = form_subjid_entered_input.value
                if (subjid_entered !== 'STUDY_ID') {
                  // change the study_id in the form
                  formResponseDoc.items[0].inputs.find(input => input.name === 'subjid_entered').value = 'STUDY_ID'
                }
              }
              try {
                await db.put(formResponseDoc)
                console.log(`Changed SUBJID and subjid_entered in Form Response ${formResponseDoc._id}`)
              } catch (err) {
                console.log(`error saving form response doc: ${err.message}`)
                return -1
              }
            }
          }
        }
      }
    }
  }
}

try {
  go()
} catch (err) {
  console.log(err.message)
}
