<template>
    <div class="container">
        <b-row>
            <b-col>
                <report-component :contentId="commentId" :contentType="reportType"></report-component>
            </b-col>
            <b-col>
                <score-comment :idComment="commentId" :id-type="scoreType"></score-comment>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import ReportComponent from '../../shared/ReportComponent'
    import ScoreComment from '../../shared/ScoreComponent'
    import {SCORE_CONTENT_TYPE} from "../../../sipsder_constants";
    import {REPORT_CONTENT_TYPES} from "../../../sipsder_constants";

    export default {
        name: "TestReport",
        components: {ScoreComment, ReportComponent},
        component: {
            ReportComponent,
            ScoreComment
        },

        data() {
            return {
                commentId: 1,
                reportType: REPORT_CONTENT_TYPES.COMMENTS,
                scoreType: SCORE_CONTENT_TYPE.COMMENTS
            }
        }
    }
</script>

<style scoped>

</style>