package it.sogei.acrgs.platformms.utils;

public class Utility {

    public boolean convertToBoolean (Integer value) {
        return value != null && value == 1;
    }

    public Integer convertToInteger(Boolean value) {
        return value != null && !value ? 1 : 0;
    }
}
