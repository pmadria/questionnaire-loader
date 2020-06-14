import React, { Component } from "react";
//import { hot } from "react-hot-loader";
import "./App.css";
import fetchArtifacts from "./util/fetchArtifacts";
import fetchFhirVersion from "./util/fetchFhirVersion";
//import QuestionnaireForm from "./components/QuestionnaireForm/QuestionnaireForm";

componentDidMount() {
    this.consoleLog("fetching artifacts", "infoClass");
    fetchFhirVersion(this.props.smart.state.serverUrl)
    .then(fhirVersion => {
      this.fhirVersion = fhirVersion;

      fetchArtifacts(
        this.props.FHIR_PREFIX,
        this.props.FILE_PREFIX,
        this.props.questionnaireUri,
        this.fhirVersion,
        this.smart,
        this.consoleLog
      )
        .then(artifacts => {
          console.log("fetched needed artifacts:", artifacts);

          let fhirWrapper = this.getFhirWrapper(this.fhirVersion);

          this.setState({ questionnaire: artifacts.questionnaire });
        })
        .then(cqlResults => {
          this.consoleLog(
            "executed cql, result:" + JSON.stringify(cqlResults),
            "infoClass"
          );
          console.log("executed cql, result:");

          // Collect all library results into a single bundle
          let allLibrariesResults = {};
          let fullBundle = null;
          cqlResults.forEach(libraryResult => {
            // add results to hash indexed by library name
            allLibrariesResults[libraryResult.libraryName] =
              libraryResult.elmResults;

            if (fullBundle == null) {
              fullBundle = libraryResult.bundle;
              // copy entire first bundle");
            } else {
              // add next bundle");
              libraryResult.bundle.entry.forEach(libraryEntry => {
                // search for the entry to see if it is already in the bundle
                let found = false;
                fullBundle.entry.forEach(fullBundleEntry => {
                  if (
                    fullBundleEntry.resource.id === libraryEntry.resource.id &&
                    fullBundleEntry.resource.resourceType ===
                      libraryEntry.resource.resourceType
                  ) {
                    // skip it
                    found = true;
                  }
                });

                // add the entry into the full bundle
                if (!found) {
                  fullBundle.entry.push(libraryEntry);
                }
              });
            }
          });
          console.log(fullBundle);
          this.setState({ bundle: fullBundle });
          this.setState({ cqlPrepoulationResults: allLibrariesResults });
        });
    });
  }