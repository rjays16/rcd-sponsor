<template>
    <div class="modal fade" id="cancelledCallModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-body text-center">
                    {{ attendee }} was not able to join the call.
                    <div class="mt-4">
                        <button type="button" class="btn btn-blue btn-send white px-4 py-2" @click="close()">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</template>

<script>
import $ from 'jquery';
export default {
    data() {
        return {
            attendee: null,
        }
    },
    methods: {
        close(){
            $(function() {
                $('#cancelledCallModal').modal('hide');
            });            
        },
        openModal(data) {
            this.attendee = data;
            $(function() {
                $('#cancelledCallModal').modal('show');
            });
        },
    }
}
</script>