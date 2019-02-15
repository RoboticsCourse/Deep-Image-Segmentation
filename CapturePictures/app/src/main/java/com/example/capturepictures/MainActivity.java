package com.example.capturepictures;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.View;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "MainActivity";
    private static final int REQUEST_CODE = 1234;
    public static String CAMERA_POSITION_FRONT;

    private boolean mPermissions;
    public String mCameraOrientation = CAMERA_POSITION_FRONT;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        init();
    }

    private void init(){
        if(mPermissions){
            if(checkCameraHardware(this)){

            }
            else{
                showSnackBar("You need a camera to use this application", Snackbar.LENGTH_INDEFINITE);
            }
        }
        else{
            verifyPermissions();
        }
    }

    /** Check if this device has a camera */
    private boolean checkCameraHardware(Context context) {
        if (context.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA)){
            return true;
        } else {
            return false;
        }
    }

    public void verifyPermissions(){
        Log.d(TAG, "verifyPermissions: asking user for permissions.");
        String[] permissions = {
                android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.CAMERA};
        if (ContextCompat.checkSelfPermission(this.getApplicationContext(),
                permissions[0] ) == PackageManager.PERMISSION_GRANTED
                && ContextCompat.checkSelfPermission(this.getApplicationContext(),
                permissions[1] ) == PackageManager.PERMISSION_GRANTED) {
            mPermissions = true;
            init();
        } else {
            ActivityCompat.requestPermissions(
                    MainActivity.this,
                    permissions,
                    REQUEST_CODE
            );
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if(requestCode == REQUEST_CODE){
            if(mPermissions){
                init();
            }
            else{
                verifyPermissions();
            }
        }
    }


    private void showSnackBar(final String text, final int length) {
        View view = this.findViewById(android.R.id.content).getRootView();
        Snackbar.make(view, text, length).show();
    }

    public void setFrontCameraId(String cameraId){
        CAMERA_POSITION_FRONT = cameraId;
    }

    public boolean isCameraFrontFacing() {
        if(mCameraOrientation.equals(CAMERA_POSITION_FRONT)){
            return true;
        }
        return false;
    }

    public String getFrontCameraId(){
        return CAMERA_POSITION_FRONT;
    }

    public void hideStatusBar() {
        View decorView = getWindow().getDecorView();
        // Hide the status bar.
        int uiOptions = View.SYSTEM_UI_FLAG_FULLSCREEN;
        decorView.setSystemUiVisibility(uiOptions);
    }

}
